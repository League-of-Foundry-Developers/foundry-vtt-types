// @ts-check

import * as fs from "fs/promises";

export default async ({ github, context, core }) => {
  const pullRequestNumber = context.payload.pull_request ? context.payload.pull_request.number : null;

  if (!pullRequestNumber) {
    core.setFailed("No PR found for this push.");
    return;
  }

  let mainResults;
  try {
    const contents = await fs.readFile("test-results/vitest-report.json", "utf-8");
    mainResults = JSON.parse(contents);
  } catch (e) {
    console.error(e.message, e.stack);
    core.setFailed(`Could not get results to compare to ${e.message}`);
    return;
  }

  const contents = await fs.readFile("new-test-results/vitest-report.json", "utf-8");
  const prResults = JSON.parse(contents);

  let fileInformation = {};
  for (const [fileName, mainErrors] of Object.entries(mainResults)) {
    const pullRequestErrors = prResults[fileName];
    if (pullRequestErrors == null) {
      fileInformation[fileName] = { type: "removed" };
      continue;
    }

    const errorCounts = {};

    for (const error of pullRequestErrors) {
      errorCounts[error.message] ??= { oldCount: 0, newCount: 0, firstLine: 0 };
      errorCounts[error.message].oldCount++;
    }

    for (const error of mainErrors) {
      errorCounts[error.message] ??= { oldCount: 0, newCount: 0, firstLine: 0 };
      errorCounts[error.message].newCount++;
    }

    let newErrors = 0;
    let unfixedErrors = 0;
    let fixedErrors = 0;

    for (const error of Object.values(errorCounts)) {
      const difference = error.oldCount - error.newCount;

      unfixedErrors += error.newCount;

      if (difference > 0) {
        fixedErrors += difference;
      } else {
        newErrors += -difference;
      }
    }

    fileInformation[fileName] = { fixedErrors, newErrors, unfixedErrors };
  }

  const files = Object.keys(fileInformation).sort();

  let reportTable = `|Changed File|Fixed Errors|New Errors|Unfixed Errors|
|-|-|-|-|
`;

  let fixedErrorsTotal = 0;
  let newErrorTotal = 0;

  let hasChanges = false;
  let noChangesInFiles = 0;
  for (const file of files) {
    const { fixedErrors, newErrors, unfixedErrors } = fileInformation[file];

    if (fixedErrors === 0 && newErrors === 0) {
      noChangesInFiles++;
      continue;
    }

    fixedErrorsTotal += fixedErrors;
    newErrorTotal += newErrors;

    hasChanges = true;
    reportTable += `|${file}|${fixedErrors}|${newErrors}|${unfixedErrors}|\n`;
  }

  const comments = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: pullRequestNumber,
  });

  const existingTestReport = comments.data.find((comment) => comment.body.includes("<!-- vitest-status -->"));

  let report;
  if (hasChanges) {
    report = `Test results:\n${reportTable}`;

    if (newErrorTotal > 0) {
      report += `\n${newErrorTotal} new errors have been introduced!`;
    }

    if (fixedErrorsTotal > 0) {
      report += `\n${fixedErrorsTotal} errors have been fixed.`;
    }

    if (noChangesInFiles > 0) {
      report += `\n${noChangesInFiles} files have no changes in errors.`;
    }
  } else {
    report = "No test files have any fixed errors or new errors.";
  }

  const newReport = `<!-- vitest-status -->\n\n${report}\n\n<sup>*This comment will be automatically updated whenever you push a commit.*</sup>`;

  if (existingTestReport?.body === newReport) {
    return;
  }

  if (existingTestReport != null) {
    await github.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: existingTestReport.id,
      body: newReport,
    });
  } else {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequestNumber,
      body: newReport,
    });
  }
};
