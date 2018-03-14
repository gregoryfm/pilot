export default number => number.padEnd(12, '*').replace(/([\S\s]{4})/g, '$1 ')

