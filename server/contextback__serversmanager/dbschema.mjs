export function getDbSchema() {
  return new Map(Object.entries({
    Contexts: {
      parentContexts: {
        type: Number,
        ref: "Contexts",
      },
      positionContexts: {
        type: Number,
        positionRef: "Contexts",
      },
      name: String,
      folderName: String,
    },
    Services: {
      parentContexts: {
        type: Number,
        ref: "Contexts",
      },
      positionContexts: {
        type: Number,
        positionRef: "Contexts",
      },
      status: String,
      "host-name": String,
      port: Number,
      "db-dic-name": String,
      "loader-path": String,
      "images-path": String
    },
  }))
}