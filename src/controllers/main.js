import fs from 'fs'
import axios from 'axios'
import { promisify } from 'util'
import util from 'util'
import child_process from 'child_process'
import { addPostcard, findPostcard } from '../helpers/database'


const exec = child_process.exec
const readdir = promisify(fs.readdir)
const mkdir = promisify(fs.mkdir)
const unlink = promisify(fs.unlink)

const randomInteger = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand)
  return rand
}

const getArrays = async () => {
  try {
    const names = await readdir('./public/names/')
    const men = []
    const girls = []

    names.forEach(file => {
      let name = file.slice(0, -4)
      name = name[0].toUpperCase() + name.substr(1, name.length)
      if (name[name.length-1] == 'а' || name[name.length-1] == 'я') girls.push(name)
      else men.push(name)
    })

    return { men, girls }
  } catch (e) { console.log('e', e) }
}

const runApp = async (req, res) => {
  const { girls, men } = await getArrays()
  res.render('main/index.pug', { men, girls })
}

const makeVideo = async (uid, name) => {
  await mkdir(`./public/ready/${uid}`)
  const random = randomInteger(1,7)
  let sirname = name[0].toLowerCase() + name.substr(1, name.length)
  const videoFile = `./public/videos/${random}.mov`
  const path = `./public/ready/${uid}`
  console.log(`${path}/final.mp4`)

  const makeFinal = (error, stdout, stderr) => {
    /*stdout ? console.log('stdout: ' + stdout) : null;
    stderr ? console.log('stderr: ' + stderr) : null;
    error ? console.log('exec error: ' + error) : null;*/
    //exec(`ffmpeg -i ${path}/videofinal.mp4 -i ${path}/audiofinal.mp3 -shortest -pix_fmt yuv420p ${path}/final.mp4`, returnRes)
    exec(`ffmpeg -i ${path}/videofinal.mp4 -i ${path}/audiofinal.mp3 \
    -c:v copy -c:a aac -strict experimental ${path}/final.mp4`, returnRes)
  }

  const cutTrack = (error, stdout, stderr) => {
    /*stdout ? console.log('stdout: ' + stdout) : null;
    stderr ? console.log('stderr: ' + stderr) : null;
    error ? console.log('exec error: ' + error) : null;*/
    exec(`ffmpeg -i ${videoFile} -an ${path}/videofinal.mp4`, makeFinal)
  } 

  const mergeMP3 = (error, stdout, stderr) => {
    /*stdout ? console.log('stdout: ' + stdout) : null;
    stderr ? console.log('stderr: ' + stderr) : null;
    error ? console.log('exec error: ' + error) : null;*/
    exec(`ffmpeg -i ${path}/main.mp3 -i ./public/names/${sirname}.mp3 -filter_complex amix=inputs=2:duration=first:dropout_transition=2 ${path}/audiofinal.mp3`, cutTrack)
  }
  
  const extractMP3 = (error, stdout, stderr) => exec(`ffmpeg -i ${videoFile} ${path}/main.mp3`, mergeMP3)

  const returnRes = (error, stdout, stderr) => {
    /*stdout ? console.log('stdout: ' + stdout) : null;
    stderr ? console.log('stderr: ' + stderr) : null;
    error ? console.log('exec error: ' + error) : null;*/
    return true
  }

  const result = extractMP3()
  return result

}

const loadToVk = async (data) => {
  //const accessKey = `217273f4710dccd257b4eaa845b8701cd7976f9e65e741dffeec85db88d3d933c027f06ec00adf7231ac3`
  //const { data:response } = await axios.get(`https://api.vk.com/method/video.save?name=${data.uid}&access_token=${accessKey}&v=5.69`)
  /*const CLIENT_ID = 6285041
  const CLIENT_SECRET = 'vEmfCcHiDmpnl5d7FifR'
  const { data: response } = await axios.get(`https://oauth.vk.com/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=5.69&grant_type=client_credentials`)

  */

  const CLIENT_ID = '6285247'
  const CLIENT_SECRET = 'iXzDiPzHGhtrAPv6tcw1'
  /*const { data: response } = await axios.get(`https://oauth.vk.com/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=5.69&grant_type=client_credentials`)
  const ACCESS_TOKEN = response.access_token
  const { data:result } = await axios.post(`https://api.vk.com/method/video.save?name=${data.uid}&access_token=${ACCESS_TOKEN}&v=5.69`)
  console.log(result)*/
  const ACCESS_TOKEN = '2ad22db82c733e01c67e1f0bf1e2ba9fe58243c268e34e6f7e2e1eae96f7a995c1ef0e12999363b44ca76'
  const { data:response } = await axios.get(`https://api.vk.com/method/video.save?name=${data.uid}&access_token=${ACCESS_TOKEN}&v=5.69`)
  console.log(response)
  //const ACCESS_TOKEN = response.access_token
  /*const ACCESS_TOKEN = 'e0367b50cbe34479e55247b0b5ea5e3cbb593a9da946100225b6a0ea3199ccf314900cff27032255b7fc2'
  const { data:result } = await axios.post(`https://api.vk.com/method/video.save?name=${data.uid}&access_token=${ACCESS_TOKEN}&v=5.69`)
  console.log(result)*/
}

const makePostcard = async (req, res) => {
  const made = await makeVideo(req.body.userID, req.body.name)
  const result = await addPostcard({ uid: req.body.userID, name: req.body.name })
  const vkResult = await loadToVk(result)
  console.log(result)
  res.send({ check: 1 })
}

export default { runApp, makePostcard }