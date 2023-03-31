import inquirer, { QuestionCollection } from "inquirer";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, parse } from "path";
import { slugify } from "./utils.js";

// dynamically populate form config dir
const projectChoices = await fs
  .readdir(dirname(fileURLToPath(import.meta.url)) + "/projectConfigs", {
    withFileTypes: true,
  })
  .then((files) => files.filter((file) => file.isDirectory));

const projectQuestion: QuestionCollection = [
  {
    type: "list",
    name: "projectType",
    message: "What type of project are you setting up?",
    choices: projectChoices,
  },
  {
    type: "input",
    name: "projectName",
    message: "Give your project a name",
  },
];

const { projectType: selectedProject, projectName }: Record<string, string> =
  await inquirer.prompt(projectQuestion);

const { setupProject } = await import(`./projectConfigs/${selectedProject}`);

const projectNameSlug = slugify(projectName);

setupProject(projectNameSlug);
