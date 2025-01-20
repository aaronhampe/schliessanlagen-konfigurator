
export function generateSizes(insideArray, outsideArray) {
    const result = []
    for (const inside of insideArray) {
      for (const outside of outsideArray) {
        result.push({ inside, outside })
      }
    }
    return result
  }
  