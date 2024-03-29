import mongoose from 'mongoose';
const {Schema, SchemaTypes} = mongoose;

// Collection names for mongoose models: Mongoose automatically looks for the plural, lowercased version of your model name

export function setDbSchema(dbLink) {
  if (!dbLink)
    dbLink = mongoose // for a maybe general connection ?''
  
  if (Object.entries(dbLink.models).length > 0) return dbLink.models;
  
  dbLink.model("UsersTypes",
    new Schema({
      type: String,
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
  
  dbLink.model("Users",
    new Schema({
      username: String,
      pwd: String,
      status: {
        type: Number,
        default: 1,
      },
      access: {
        type: Date,
        default: Date.now,
      },
      creationDate: {
        type: Date,
        default: Date.now,
      },
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
      fullname: String,
      streetaddress: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
      comments: String,
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
      price: Number,
      currencyCode: String,
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
      moduleName: String,
      vars: String, // public paymentAccount vars
      active: Number,
      parentPaymentTypes: {
        type: SchemaTypes.ObjectId,
        ref: "PaymentTypes",
      },
      positionPaymentTypes: {
        type: Number,
        positionRef: "PaymentTypes",
      }
    })
  )

  dbLink.model("PaymentTypesPrivate",
    new Schema({
      vars: String, // private paymentAccount vars
      parentPaymentTypes: {
        type: SchemaTypes.ObjectId,
        ref: "PaymentTypes",
      }
    })
  )
    
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
  )

  dbLink.model("ShippingTypes",
    new Schema({
      image: String,
      delay_hours: Number,
      price: Number,
      parentShippingTypes: {
        type: SchemaTypes.ObjectId,
        ref: "ShippingTypes",
      },
      positionShippingTypes: {
        type: Number,
        positionRef: "ShippingTypes",
      }
    })
  )

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
      creationDate: {
        type: Date,
        default: Date.now,
      },
      modificationDate: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: Number,
        default: 1,
      },
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
      currencyCode: String,
      parentOrders: {
        type: SchemaTypes.ObjectId,
        ref: "Orders",
      },
      parentItems: {
        type: SchemaTypes.ObjectId,
        ref: "Items",
      }
    })
  );
    
  dbLink.model("OrderPayment",
    new Schema({
      name: String,
      details: String,
      succeed: Number,
      parentOrders: {
        type: SchemaTypes.ObjectId,
        ref: "Orders",
      },
      parentPaymentTypes: {
        type: SchemaTypes.ObjectId,
        ref: "PaymentTypes",
      }
    })
  );

  dbLink.model("OrderShipping",
    new Schema({
      name: String,
      delay_hours: Number,
      price: Number,
      currencyCode: String,
      parentOrders: {
        type: SchemaTypes.ObjectId,
        ref: "Orders",
      },
      parentShippingTypes: {
        type: SchemaTypes.ObjectId,
        ref: "ShippingTypes",
      }
    })
  );

  dbLink.model("OrderAddress",
    new Schema({
      fullname: String,
      streetaddress: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
      comments: String,
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