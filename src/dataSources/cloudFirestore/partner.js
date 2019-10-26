const event = dbInstance => {
  const collectionName = 'partners';
  const partnersCollection = dbInstance.collection(collectionName);

  const create = async newPartner => {
    const scrubbedPartner = newPartner;

    const newDocument = await partnersCollection.add(scrubbedPartner);

    return {
      id: newDocument.id,
      ...scrubbedPartner,
    };
  };

  const get = async id => {
    const docRef = dbInstance.doc(`${collectionName}/${id}`);
    const doc = await await docRef.get();

    return {
      id: doc.id,
      ...doc.data(),
    };
  };

  const getAll = async () => {
    const { docs } = await partnersCollection.get();

    return docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
  };

  return { create, getAll, get };
};

export default event;