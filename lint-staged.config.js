module.exports = {
  '**/*.{js,ts,vue}': (filenames) => {
    const files = filenames.filter((file) => !file.endsWith('.d.ts'))
    if (files.length === 0) return []
    return `eslint --fix --ignore-path .eslintignore ${files
      .map((file) => JSON.stringify(file))
      .join(' ')}`
  },
}
