import mongoose from 'mongoose';
const {Schema, SchemaTypes} = mongoose;

export function setDbSchema(dbLink) {
  if (!dbLink) dbLink=mongoose;
  
  if (Object.entries(dbLink.models).length > 0) return dbLink.models;
  
  dbLink.model("UsersTypes",
    new Schema({
      type: String,
      positionUsersTypes: {
        type: Number,
        positionRef: "UsersTypes",
      }
    })
  );
  
  dbLink.model("Users",
    new Schema({
      username: String,
      pwd: String,
      status: Number,
      access: Date,
      creationDate: Date,
      parentUsersTypes: {
        type: SchemaTypes.ObjectId,
        ref: "UsersTypes",
      },
      positionUsersTypes: {
        type: Number,
        positionRef: "UsersTypes",
      }
    })
  );
    
  dbLink.model("Addresses",
    new Schema({
      streetaddress: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
      parentUsers: {
        type: SchemaTypes.ObjectId,
        ref: "Users",
      }
    })
  );
    
  dbLink.model("UsersData",
    new Schema({
      fullname: String,
      emailaddress: String,
      phonenumber: String,
      parentUsers: {
        type: SchemaTypes.ObjectId,
        ref: "Users",
      }
    })
  );
  
  dbLink.model("Languages",
    new Schema({
      code: String,
      parentLanguages: {
        type: SchemaTypes.ObjectId,
        ref: "Languages",
      },
      positionLanguages: {
        type: Number,
        positionRef: "Languages",
      }
    })
  );

  dbLink.model("SiteElements",
    new Schema({
      name: String,
      parentSiteElements: {
        type: SchemaTypes.ObjectId,
        ref: "SiteElements",
      },
      positionSiteElements: {
        type: Number,
        positionRef: "SiteElements",
      }
    })
  );
    
  dbLink.model("SiteElementsData",
    new Schema({
      value: String,
      parentSiteElements: {
        type: SchemaTypes.ObjectId,
        ref: "SiteElements",
      },
      parentLanguages: {
        type: SchemaTypes.ObjectId,
        ref: "Languages",
      }
    })
  );
    
  dbLink.model("PageElements",
    new Schema({
      name: String,
      parentPageElements: {
        type: SchemaTypes.ObjectId,
        ref: "PageElements",
      },
      positionPageElements: {
        type: Number,
        positionRef: "PageElements",
      }
    })
  );
  // This will ensure Db consistency
    /*
  dbLink.model("PageElements").schema.pre('remove', function(next) {
    dbLink.model("PageElements").remove({parentPageElements: this._id}).exec();
    dbLink.model("PageElementsData").remove({parentPageElements: this._id}).exec();
    next();
});
    */
    
  dbLink.model("PageElementsData",
    new Schema({
      value: String,
      parentPageElements: {
        type: SchemaTypes.ObjectId,
        ref: "PageElements",
      },
      parentLanguages: {
        type: SchemaTypes.ObjectId,
        ref: "Languages",
      }
    })
  );
    
  dbLink.model("ItemCategories",
    new Schema({
      parentItemCategories: {
        type: SchemaTypes.ObjectId,
        ref: "ItemCategories",
      },
      positionItemCategories: {
        type: Number,
        positionRef: "ItemCategories",
      }
    })
  );
    
  dbLink.model("ItemCategoriesData",
    new Schema({
      name: String,
      parentItemCategories: {
        type: SchemaTypes.ObjectId,
        ref: "ItemCategories",
      },
      parentLanguages: {
        type: SchemaTypes.ObjectId,
        ref: "Languages",
      }
    })
  );
    
  dbLink.model("Items",
    new Schema({
      parentItemCategories: {
        type: SchemaTypes.ObjectId,
        ref: "ItemCategories",
      },
      positionItemCategories: {
        type: Number,
        positionRef: "ItemCategories",
      },
      parentUsers: {
        type: SchemaTypes.ObjectId,
        ref: "Users",
      },
    })
  );
    
  dbLink.model("ItemsData",
    new Schema({
      name: String,
      descriptionlarge: String,
      descriptionshort: String,
      price: Number,
      parentItems: {
        type: SchemaTypes.ObjectId,
        ref: "Items",
      },
      parentLanguages: {
        type: SchemaTypes.ObjectId,
        ref: "Languages",
      }
    })
  );
    
  dbLink.model("ItemsImages",
    new Schema({
      imagename: String,
      parentItems: {
        type: SchemaTypes.ObjectId,
        ref: "Items",
      },
      positionItems: {
        type: Number,
        positionRef: "Items",
      }
    })
  );
    
  dbLink.model("PaymentTypes",
    new Schema({
      image: String,
      vars: String,
      template: String,
      active: Number,
      positionPaymentTypes: {
        type: Number,
        positionRef: "PaymentTypes",
      }
    })
  );
    
  dbLink.model("PaymentTypesData",
    new Schema({
      name: String,
      description: String,
      parentPaymentTypes: {
        type: SchemaTypes.ObjectId,
        ref: "PaymentTypes",
      },
      parentLanguages: {
        type: SchemaTypes.ObjectId,
        ref: "Languages",
      }
    })
  );
    
  dbLink.model("ShippingTypes",
    new Schema({
      image: String,
      delay_hours: Number,
      price: Number,
      positionShippingTypes: {
        type: Number,
        positionRef: "ShippingTypes",
      }
    })
  );
    
  dbLink.model("ShippingTypesData",
    new Schema({
      name: String,
      description: String,
      parentShippingTypes: {
        type: SchemaTypes.ObjectId,
        ref: "ShippingTypes",
      },
      parentLanguages: {
        type: SchemaTypes.ObjectId,
        ref: "Languages",
      }
    })
  );
    
  dbLink.model("Orders",
    new Schema({
      creationDate: Date,
      modificationDate: Date,
      status: Number,
      parentUsers: {
        type: SchemaTypes.ObjectId,
        ref: "Users",
      }
    })
  );
    
  dbLink.model("OrderItems",
    new Schema({
      quantity: Number,
      name: String,
      price: Number,
      parentOrders: {
        type: SchemaTypes.ObjectId,
        ref: "Orders",
      }
    })
  );
    
  dbLink.model("OrderPaymentTypes",
    new Schema({
      name: String,
      details: String,
      succed: Number,
      parentOrders: {
        type: SchemaTypes.ObjectId,
        ref: "Orders",
      }
    })
  );

  dbLink.model("OrderShippingTypes",
    new Schema({
      name: String,
      delay_hours: Number,
      price: Number,
      parentOrders: {
        type: SchemaTypes.ObjectId,
        ref: "Orders",
      }
    })
  );

  dbLink.model("Cache",
    new Schema({
      key: String,
      value: String,
      isJSON: Boolean,
    })
  );

  Object.entries(dbLink.models).forEach(model => model[1].schema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  }));
  
  return dbLink.models;
}
/*
async function populateDb() {
  await mongoose.connection.dropDatabase();
  await dbLink.models["Languages"].create({code: "en"});
}
*/