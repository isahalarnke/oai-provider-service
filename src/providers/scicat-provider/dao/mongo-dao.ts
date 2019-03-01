import logger from "../../../server/logger";
import { getCredentials, hasCredentialsFile } from "../../core/credentials";

//const express = require('express')
//const app = express()
//const bodyParser = require('body-parser')
const MongoClient = require("mongodb").MongoClient;

/**
 * This is the DAO service for Scicat. It uses a mongo connection
 * to retrieve data.  Database connection parameters are
 * provided by the credentials file (path defined in .env).
 */
export class MongoConnector {
  //private pool: Pool;
  public static instance: MongoConnector;
  public db: null;

  private constructor() {
    logger.debug("Setting up the mongo connection.");

    // Get path from the environment.
    const credFile = process.env.TAGGER_CONFIGURATION;

    /*if (hasCredentialsFile(credFile)) {
      const creds = getCredentials(credFile);
    }*/

    MongoClient.connect("mongodb://localhost:27017", (err, client) => {
      if (err) return console.log(err);
      this.db = client.db("aoi-publications");
    });
  }

  public static getInstance(): MongoConnector {
    try {
      if (this.instance) {
        return this.instance;
      }
      this.instance = new MongoConnector();
      return this.instance;
    } catch (err) {
      throw new Error("Failed to get MongoConnector instance: " + err.message);
    }
  }

  /**
   * Responds to OAI ListRecords requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public recordsQuery(parameters: any): Promise<any> {
    let Publication = this.db.collection("Publication");
    //console.log("-----XgetRecord", Publication);
    return new Promise((resolve: any, reject: any) => {
      Publication.find().toArray(function(err, items) {
        if (err) {
          reject(err);
        } else {
          console.log(items);
          resolve(items);
        }
      });
    });
  }

  /**
   * Responds to OAI ListIdentifiers requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public identifiersQuery(parameters: any): Promise<any> {
    return null;
  }

  /**
   * Responds to OAI GetRecord requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public getRecord(parameters: any): Promise<any> {
    return null;
  }

  private aggregatePublicationQuery(pipeline: any): Promise<any> {
    var collection = this.db.collection("Publication");
    var resolve = null;
    return new Promise((resolve: any, err: any) => {
      var resolve = collection.aggregate(pipeline, function(err, cursor) {
        cursor.toArray(function(err, resolve) {
          if (err) {
            console.log("recordsQuery error:", err);
          }
        });
      });
    });
  }
}
