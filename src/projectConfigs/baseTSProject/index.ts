import fs from "node:fs/promises";
import { spawn } from "node:child_process";

export const setupProject = async function (projectName: string) {
  const cwdSpawn = (command: string, args: string[]) => {
    return spawn(command, args, { cwd: projectPath });
  };

  let projectPath: string | undefined;
  if (projectName === ".") {
    projectPath = process.cwd();
    await fs.mkdir(`${projectPath}/${projectName}/src`, {
      recursive: true,
    });
  } else {
    projectPath = await fs.mkdir(`${process.cwd()}/${projectName}/src`, {
      recursive: true,
    });
  }

  if (!projectPath) throw Error("Failed to create directory");

  const gitInit = () => {
    return cwdSpawn("git", ["init"]);
  };
  const npmInstall = () => {
    return cwdSpawn("npm", ["init", "-y"]);
  };
  const npmInstallDev = () =>
    cwdSpawn("npm", [
      "i",
      "-D",
      "typescript",
      "@types/node",
      "jest",
      "ts-jest",
      "@types/jest",
    ]);
  const tscConfig = () =>
    cwdSpawn("npx", [
      "tsc",
      "--init",
      "--target",
      "ESNext",
      "--module",
      "NodeNext",
      "--rootDir",
      "./src",
      "--moduleResolution",
      "nodenext",
      "--declaration",
      "true",
      "--outDir",
      "./dist",
      "--esModuleInterop",
      "true",
      "--forceConsistentCasingInFileNames",
      "true",
      "--strict",
      "true",
      "--skipLibCheck",
      "true",
    ]);
  const gitInitProcess = gitInit();
  gitInitProcess.on("close", () => {
    const npmInstallProcess = npmInstall();
    npmInstallProcess.stdout.on("data", (data) => console.log(data.toString()));

    const npmInstallDevProcess = npmInstallProcess.on("close", npmInstallDev);

    npmInstallProcess.on("close", tscConfig);
    npmInstallProcess.on("close", async () => {
      const npmPackagePath = `${projectPath}/package.json`;
      const npmPackage = JSON.parse(await fs.readFile(npmPackagePath, "utf8"));
      npmPackage["jest"] = {
        moduleNameMapper: {
          "(.+)\\.js": "$1",
        },
        transform: {
          "^.+\\.tsx?$": [
            "ts-jest",
            {
              useESM: true,
            },
          ],
        },
      };
      await fs.writeFile(npmPackagePath, JSON.stringify(npmPackage, null, 2));
    });
  });
};
