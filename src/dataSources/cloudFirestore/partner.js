import debug from 'debug';

const dlog = debug('that:api:partners:datasources:firebase:partner');

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
    const doc = await docRef.get();

    return {
      id: doc.id,
      ...doc.data(),
    };
  };

  const findBySlug = async slug => {
    const docRef = partnersCollection.where('slug', '==', slug);
    const docs = await docRef.get();

    const results = [];

    docs.forEach(d => {
      results.push({
        id: d.id,
        ...d.data(),
      });
    });

    return results;
  };

  const getAll = async () => {
    const { docs } = await partnersCollection.get();

    return docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
  };

  // https://googleapis.dev/nodejs/firestore/latest/DocumentReference.html#update
  const update = async (id, newPartner) => {
    dlog('updating id %o', id);

    const scrubbedPartner = newPartner;

    const docRef = dbInstance.doc(`${collectionName}/${id}`);
    await docRef.update(scrubbedPartner); // would be nice to handle this better rather than just echo'n our input

    return {
      id,
      ...scrubbedPartner,
    };
  };

  return { create, getAll, get, findBySlug, update };
};

export default event;
