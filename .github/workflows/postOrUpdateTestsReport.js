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
  const pullRequestResults = JSON.parse(contents);

  let fileInformation = {};
  for (const [fileName, mainErrors] of Object.entries(mainResults)) {
    const pullRequestErrors = pullRequestResults[fileName];
    if (pullRequestErrors == null) {
      fileInformation[fileName] = { type: "deleted", oldCount: 0, newCount: 0 };
      continue;
    }

    const errorCounts = {};

    for (const error of pullRequestErrors) {
      errorCounts[error.message] ??= {
        oldCount: 0,
        newCount: 0,
      };
      errorCounts[error.message].oldCount++;
    }

    for (const error of mainErrors) {
      errorCounts[error.message] ??= {
        oldCount: 0,
        newCount: 0,
      };
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

    fileInformation[fileName] = {
      type: "in-both",
      fixedErrors,
      newErrors,
      unfixedErrors,
    };
  }

  for (const [fileName, pullRequestResultErrors] of Object.entries(pullRequestResults)) {
    fileInformation[fileName] ??= {
      type: "new",
      fixedErrors: 0,
      newErrors: pullRequestResultErrors.length,
      unfixedErrors: 0,
    };
  }

  const files = Object.keys(fileInformation);

  let reportTable = `|Changed File|Fixed Errors|New Errors|Unfixed Errors|
|-|-|-|-|
`;

  let fixedErrorsTotal = 0;
  let newErrorTotal = 0;

  let hasChanges = false;
  let noChangesInFiles = 0;
  for (const file of files) {
    const { type, fixedErrors, newErrors, unfixedErrors } = fileInformation[file];

    if (type === "deleted") {
      reportTable += `|${file} - ***DELETED***|-|-|-|\n`;
      hasChanges = true;
      continue;
    } else if (type === "new") {
      reportTable += `|${file} - ***NEW***|-|${newErrors}|-|\n`;
      continue;
    } else if (fixedErrors === 0 && newErrors === 0) {
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

  const newReport = `<!-- vitest-status -->\n\n${report}\n\n<sub>*This comment will be automatically updated whenever you push a commit.*</sub>`;

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
