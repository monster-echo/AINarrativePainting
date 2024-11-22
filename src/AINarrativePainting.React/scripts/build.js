import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const sourceDir = path.join(__dirname, "../dist")
const targetDir = path.join(
  __dirname,
  "../../AINarrativePainting.App/Resources/Raw/wwwroot"
)

try {
  // Log absolute paths
  console.log("Source directory:", path.resolve(sourceDir))
  console.log("Target directory:", path.resolve(targetDir))

  // Check if source exists
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source directory doesn't exist: ${sourceDir}`)
  }

  // Create target directory if it doesn't exist
  fs.ensureDirSync(targetDir)

  // List files before copy
  console.log("Files in source:", fs.readdirSync(sourceDir))

  // Copy files
  // fs.emptyDirSync(targetDir)
  fs.copySync(sourceDir, targetDir)

  // Verify copy
  console.log("Files copied to target:", fs.readdirSync(targetDir))
} catch (error) {
  console.error("Error during file operations:", error)
}
