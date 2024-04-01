import {rename} from "fs"
//import {join} from "path"

const destinations = ["../../client/context__dbmanager", "../../server/context__dbmanager", "../../loader/dbmanager", "../../layouts/dbmanager"]
const origins = ["move_to_client/context__dbmanager", "move_to_server/context__dbmanager", "move_to_loader/dbmanager", "move_to_layouts/dbmanager"]
moveForInstall(origins, destinations)

function moveForInstall(origins, destinations) {
  for (let i = 0; i<origins.length; i++) {
    rename (origins[i], destinations[i], function (err) {
      if (err) throw err
    })
  }
}