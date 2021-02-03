// Utility functions
const convertSnapshot = (snapshot) => {
  return snapshot.docs.map(function(doc) {
    return { id: doc.id, ...doc.data() }
  })
}

const convertDoc = (doc) => {
  return { id: doc.id, ...doc.data() }
}

export { convertSnapshot, convertDoc };
