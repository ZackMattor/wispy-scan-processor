import express from 'express'
import fs from 'fs'
import { getCsvFiles, getCsvFile, deleteFile } from '../src/wispy_client.js'

const TEST_ENDPOINT = 'http://localhost'

function endpoint(port) {
  return `${TEST_ENDPOINT}:${port}`
}

test('WiSpy client can get a list of csv items', async () => {
  const app = express()

  app.get('/', (_req, res) => {
    fs.createReadStream('test/fixtures/wispi-index.html').pipe(res)
  })

  const server = app.listen(0)

  const data = await getCsvFiles(endpoint(server.address().port))

  server.close()

  expect(data.length).toEqual(15)
  expect(data).toEqual(
      [
      'wd3-1.csv',  'wd3-11.csv',
      'wd3-12.csv', 'wd3-2.csv',
      'wd3-3.csv',  'wd3-4.csv',
      'wd3-5.csv',  'wd3-6.csv',
      'wd3-7.csv',  'wd3-8.csv',
      'wd3-9.csv',  'wd3-10.csv',
      'wd3-13.csv', 'wd3-14.csv',
      'wd3-15.csv'
    ]
  )
})

test(' WiSpy client can download a file', async () => {
  expect.assertions(2);

  const app = express()

  app.get('/download', (req, res) => {
    expect(req.query.fn).toEqual('/wd3-2.csv')
    res.send('csv content')
  })

  const server = app.listen(0)

  const data = await getCsvFile(endpoint(server.address().port), 'wd3-2.csv')

  server.close()

  expect(data).toEqual('csv content')
})

test('WiSpy client can delete a file', async () => {
  expect.assertions(1);

  const app = express()

  app.get('/confirmdelete', (req, res) => {
    expect(req.query.fn).toEqual('/wd3-2.csv')
    res.send('OK')
  })

  const server = app.listen(0)

  await deleteFile(endpoint(server.address().port), 'wd3-2.csv')

  server.close()
})
