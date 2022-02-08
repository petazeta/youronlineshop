import mongoose from 'mongoose';

function setDbSchema() {
  
  if (Object.entries(mongoose.models).length > 0) return mongoose.models;
  
  mongoose.model("UsersTypes",
    new mongoose.Schema({
      type: String,
      positionUsersTypes: {
        type: Number,
        positionRef: "UsersTypes",
      }
    })
  );
  
  mongoose.model("Users",
    new mongoose.Schema({
      username: String,
      pwd: String,
      status: Number,
      access: Number,
      parentUsersTypes: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "UsersTypes",
      },
      positionUsersTypes: {
        type: Number,
        positionRef: "UsersTypes",
      }
    })
  );
    
  mongoose.model("Addresses",
    new mongoose.Schema({
      streetaddress: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
      parentUsers: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
      }
    })
  );
    
  mongoose.model("UsersData",
    new mongoose.Schema({
      fullname: String,
      emailaddress: String,
      phonenumber: String,
      parentUsers: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
      }
    })
  );
  
  mongoose.model("Languages",
    new mongoose.Schema({
      code: String,
      positionLanguages: {
        type: Number,
        positionRef: "Languages",
      }
    })
  );

  mongoose.model("SiteElements",
    new mongoose.Schema({
      name: String,
      parentSiteElements: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "SiteElements",
      },
      positionSiteElements: {
        type: Number,
        positionRef: "SiteElements",
      }
    })
  );
    
  mongoose.model("SiteElementsData",
    new mongoose.Schema({
      value: String,
      parentSiteElements: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "SiteElements",
      },
      parentLanguages: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Languages",
      }
    })
  );
    
  mongoose.model("PageElements",
    new mongoose.Schema({
      name: String,
      parentPageElements: {
        type: mongoose.SchemaTypes.ObjectId,
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
  mongoose.model("PageElements").schema.pre('remove', function(next) {
    mongoose.model("PageElements").remove({parentPageElements: this._id}).exec();
    mongoose.model("PageElementsData").remove({parentPageElements: this._id}).exec();
    next();
});
    */
    
  mongoose.model("PageElementsData",
    new mongoose.Schema({
      value: String,
      parentPageElements: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "PageElements",
      },
      parentLanguages: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Languages",
      }
    })
  );
    
  mongoose.model("ItemCategories",
    new mongoose.Schema({
      parentItemCategories: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "ItemCategories",
      },
      positionItemCategories: {
        type: Number,
        positionRef: "ItemCategories",
      }
    })
  );
    
  mongoose.model("ItemCategoriesData",
    new mongoose.Schema({
      name: String,
      parentItemCategories: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "ItemCategories",
      },
      parentLanguages: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Languages",
      }
    })
  );
    
  mongoose.model("Items",
    new mongoose.Schema({
      parentItemCategories: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "ItemCategories",
      },
      positionItemCategories: {
        type: Number,
        positionRef: "ItemCategories",
      },
      parentUsers: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
      },
    })
  );
    
  mongoose.model("ItemsData",
    new mongoose.Schema({
      name: String,
      descriptionlarge: String,
      descriptionshort: String,
      price: Number,
      parentItems: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Items",
      },
      parentLanguages: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Languages",
      }
    })
  );
    
  mongoose.model("ItemsImages",
    new mongoose.Schema({
      imagename: String,
      parentItems: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Items",
      },
      positionItems: {
        type: Number,
        positionRef: "Items",
      }
    })
  );
    
  mongoose.model("PaymentTypes",
    new mongoose.Schema({
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
    
  mongoose.model("PaymentTypesData",
    new mongoose.Schema({
      name: String,
      description: String,
      parentPaymentTypes: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "PaymentTypes",
      },
      parentLanguages: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Languages",
      }
    })
  );
    
  mongoose.model("ShippingTypes",
    new mongoose.Schema({
      image: String,
      delay_hours: Number,
      price: Number,
      positionShippingTypes: {
        type: Number,
        positionRef: "ShippingTypes",
      }
    })
  );
    
  mongoose.model("ShippingTypesData",
    new mongoose.Schema({
      name: String,
      description: String,
      parentShippingTypes: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "ShippingTypes",
      },
      parentLanguages: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Languages",
      }
    })
  );
    
  mongoose.model("Orders",
    new mongoose.Schema({
      creationdate: Date,
      modificationdate: Date,
      status: Number,
      parentUsers: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
      }
    })
  );
    
  mongoose.model("OrderItems",
    new mongoose.Schema({
      quantity: Number,
      name: String,
      price: Number,
      parentOrders: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Orders",
      }
    })
  );
    
  mongoose.model("OrderPaymentTypes",
    new mongoose.Schema({
      name: String,
      details: String,
      succed: Number,
      parentOrders: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Orders",
      }
    })
  );

  mongoose.model("OrderShippingTypes",
    new mongoose.Schema({
      name: String,
      delay_hours: Number,
      price: Number,
      parentOrders: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Orders",
      }
    })
  );
  Object.entries(mongoose.models).forEach(model => model[1].schema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  }));
  
  return mongoose.models;
}

async function populateDb() {
  //await mongoose.connection.dropDatabase();
  //await mongoose.models["Languages"].create({code: "en"});
}
    
export {setDbSchema, populateDb};