// @ts-check

// console would count as undefined which would be very annoying.
/* eslint-disable no-undef */

import * as fs from "fs/promises";

/**
 * @typedef {ReturnType<import("@actions/github").getOctokit>} GitHub
 */

/**
 * @typedef Context
 * @property {{ pull_request?: { number: number } }} payload
 * @property {{ owner: string; repo: string }} repo
 */

/**
 * @typedef ReportArguments
 * @property {GitHub} github
 * @property {Context} context
 * @property {import("@actions/core")} core
 */

/**
 * @typedef {Record<string, string>} TestResults
 */

/**
 * @param {ReportArguments} arguments
 */
async function postOrUpdateTestsReport({ github, context, core }) {
  const pullRequestNumber = context.payload.pull_request ? context.payload.pull_request.number : null;

  if (!pullRequestNumber) {
    core.setFailed("No PR found for this push.");
    return;
  }

  /**
   * @type {TestResults}
   */
  let mainResults;
  try {
    const contents = await fs.readFile("main-test-results/vitest-report.json", "utf-8");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mainResults = /** @type {TestResults} */ (JSON.parse(contents));
  } catch (e) {
    if (!(e instanceof Error)) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      core.setFailed(`Could not get results to compare: ${e}`);
      return;
    }

    console.error(e.message, e.stack);
    core.setFailed(`Could not get results to compare: ${e.message}`);
    return;
  }

  console.log("Main Test Results");
  console.log("-----------------");
  console.log(JSON.stringify(mainResults, null, 2));

  const contents = await fs.readFile("pr-test-results/vitest-report.json", "utf-8");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const pullRequestResults = /** @type {TestResults} */ (JSON.parse(contents));

  console.log("PR Test Results");
  console.log("---------------");
  console.log(JSON.stringify(pullRequestResults, null, 2));

  /**
   * @type {Record<string, { type: "deleted" | "in-both" | "new"; fixedErrors: number; newErrors: number; unfixedErrors: number }>}
   */
  let fileInformation = {};
  for (const [fileName, mainErrors] of Object.entries(mainResults)) {
    const pullRequestErrors = pullRequestResults[fileName];
    if (pullRequestErrors == null) {
      fileInformation[fileName] = { type: "deleted", fixedErrors: 0, newErrors: 0, unfixedErrors: 0 };
      continue;
    }

    /**
     * @type {Record<string, { oldCount: number; newCount: number }>}
     */
    const errorCounts = {};

    for (const error of mainErrors) {
      errorCounts[error] ??= {
        oldCount: 0,
        newCount: 0,
      };
      errorCounts[error].oldCount++;
    }

    for (const error of pullRequestErrors) {
      errorCounts[error] ??= {
        oldCount: 0,
        newCount: 0,
      };
      errorCounts[error].newCount++;
    }

    let newErrors = 0;
    let unfixedErrors = 0;
    let fixedErrors = 0;

    for (const error of Object.values(errorCounts)) {
      const difference = error.oldCount - error.newCount;

      if (difference > 0) {
        fixedErrors += difference;
        unfixedErrors += error.newCount;
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

  const files = Object.keys(fileInformation).sort();

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
      report += `\n${noChangesInFiles} tests have no changes.`;
    }
  } else {
    report = "No test files have any fixed errors or new errors.";
  }

  const newReport = `<!-- vitest-status -->\n\n${report}\n\n<sub>*This comment will be automatically updated whenever you push a commit.*</sub>`;

  const comments = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: pullRequestNumber,
  });

  const existingTestReport = comments.data.find((comment) => comment.body?.includes("<!-- vitest-status -->"));

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
}

export default postOrUpdateTestsReport;
