import {pipeline} from 'stream';
import dbGateway from './dbgateway.mjs';

export default async function sendDbCache(request, response) {
  console.log("sending cache");
  let half=dbGateway.dbLink.model('Cache').findOne({key: 'siteText'}, {value: 1});

    half.cursor({transform: test})
    .pipe(response);

    function test(x){
      let y = x.value;
      console.log('y length', y.length);
      return y;
    };

  async function * parseContent(source) {
    let currentElement;
    for await (const chunk of source) {
      yield innerParseContent(chunk, entriesBoundary);
    }
    function innerParseContent(chunk, entriesBoundary) {
      /*
      if (chunk.toString('latin1').includes(entriesBoundary)) {
        const entireElements=[];
        const splited=chunk.toString('latin1').split(entriesBoundary);
        }
      }
      */
      return chunk;
    }
  }
  /* JSON.stringify
  return new Promise((resolve, reject)=>{
    

    readStream.on('open', () => {
      readStream.pipe(response);
    });

    readStream.on('error', function (err) {
      response.end();
      readStream.destroy();
      reject(err);
    });

    return pipeline(
      readStream,
      response,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
  */
}