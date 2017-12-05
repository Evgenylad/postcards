import { Postcard } from '../models'


export async function findPostcard(uid, name) {
  try {
    return Postcard.findOne({ uid: uid, name: name })
  }
  catch (error) {
    console.info(error)
    return null
  }
}

export async function addPostcard(postcard) {
  try {
    const dbcard = await findPostcard(postcard.uid, postcard.name)
    if (dbcard) {
      return dbcard
    }
    const newPostcard = new Postcard({
      uid: postcard.uid,
      name: postcard.name,
      browserID: postcard.browserID
    })
    return newPostcard.save()
  }
  catch (error) {
    console.info(error)
    return null
  }
}

export async function editClient(data) {
  let dbclient = await findClient(data.uid)
  if (dbclient === null) {
    throw new Error(`Невозможно обновить монитор зрителя ${__filename} -> 39`)
  }
  data.updated_at = moment().unix() // eslint-disable-line no-param-reassign
  dbclient = Object.assign(dbclient, data)
  return dbclient.save()
}


export default {
  findPostcard, addPostcard
}
