import * as AWS from 'aws-sdk';
import { CalculateRouteCarModeOptions, CalculateRouteMatrixRequest, CalculateRouteMatrixRequestDeparturePositionsList, CalculateRouteMatrixRequestDestinationPositionsList, CalculateRouteMatrixResponse, CalculateRouteRequest, CalculateRouteResponse, SearchPlaceIndexForPositionRequest, SearchPlaceIndexForPositionResponse, SearchPlaceIndexForTextRequest, SearchPlaceIndexForTextResponse } from 'aws-sdk/clients/location';
import { Longitude } from 'aws-sdk/clients/quicksight';
import { string } from 'joi';
import { Double } from 'mongodb';

export class LocationService {
    constructor() {}

    private readonly awsLocationService = new AWS.Location({
        region: process.env.AWS_LOCATION_REGION || 'ap-southeast-1',
        credentials: {
            accessKeyId: 'AKIARLTBZ7EUNFRDIVFP',
            secretAccessKey: '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'
        }
    })

    // public async searchLocationByPosition(
    //     longitude: number,
    //     latitude: number,
    //     maxResults?: number
    // ): Promise<SearchPlaceIndexForPositionResponse> {
    //     console.log(`long: ${longitude} - lat: ${latitude}`)
    //     const locationParams: SearchPlaceIndexForPositionRequest = {
    //         IndexName: process.env.AWS_LOCATION_INDEX_NAME || 'Stag_index',
    //         Language: 'vi',
    //         MaxResults: maxResults || 1,
    //         Position: [longitude, latitude]
    //     }
    //     // console.log("locationParams: ", locationParams)

    //     return new Promise((resolve, reject) => {
    //         this.awsLocationService.searchPlaceIndexForPosition(locationParams, function (error, data) {
    //             if (error) {
    //                 console.log(`Search place index to AWS Location has error: ${error}`)
    //                 reject(error as AWS.AWSError)
    //             } else {
    //                 console.log(`Search place index to AWS Location successful: ${JSON.stringify(data)}`)
    //                 resolve(data as SearchPlaceIndexForPositionResponse)
    //             }
    //         })
    //     })
    // }

    public async searchLocationByText(
        text: string,
        maxResults?: number
    ): Promise<SearchPlaceIndexForTextResponse> {
        console.log(`text: ${text}`)
        const locationParams: SearchPlaceIndexForTextRequest = {
            IndexName: process.env.AWS_LOCATION_INDEX_NAME || 'Stag_index',
            Language: 'vi',
            MaxResults: maxResults || 1,
            Text: text
        }
        console.log("locationParams: ", locationParams)

        return new Promise((resolve, reject) => {
            this.awsLocationService.searchPlaceIndexForText(locationParams, function (error, data) {
                if (error) {
                    console.log(`Search place index to AWS Location has error: ${error}`)
                    reject(error as AWS.AWSError)
                } else {
                    console.log(`Search place index to AWS Location successful: ${JSON.stringify(data)}`)
                    console.log("data 1 is : " , data)
                    resolve(data as SearchPlaceIndexForTextResponse)
                }
            })
        })
    }

    // public twoDecimal(yourNumber: number) {
    //     return parseFloat("" + Math.round(yourNumber * 100) / 100).toFixed(2);
    // }

    public async calculateRoute(
        startLong: number,
        startLat: number,
        endLong: number,
        endLat: number
    ): Promise<CalculateRouteResponse> {
        // console.log(`text: ${text}`)
        const locationParams: CalculateRouteRequest = {
            CalculatorName: "explore.route-calculator",
            DeparturePosition: [
                startLong, startLat
            ],
            DestinationPosition: [
                endLong, endLat
            ]
        }
        // console.log("locationParams: ", locationParams)

        return new Promise((resolve, reject) => {
            this.awsLocationService.calculateRoute(locationParams, function (error, data) {
                if (error) {
                    console.log(`Search place index to AWS Location has error: ${error}`)
                    reject(error as AWS.AWSError)
                } else {
                    console.log(`Search place index to AWS Location successful: ${JSON.stringify(data)}`)
                    console.log("data 1 is : " , data)
                    resolve(data as CalculateRouteResponse)
                }
            })
        })
    }

    // public async calculateRouteMatrix(
    //     CalculatorName:string ,
    //     Start_longtitude: number ,
    //     Start_latitude :number ,
    //     End_longtitude: number ,
    //     End_latitude :number ,
    //     type_ofCar:string  ,
    //     Double: Double[]

        
    // ): Promise<CalculateRouteMatrixResponse> {
    //     // console.log(`text: ${lo} , ${latitude}`)
    //     const locationParams: CalculateRouteMatrixRequest = {
    //         CalculatorName:CalculatorName,
    //         DeparturePositions:position[ 
    //             Double[Start_longtitude, Start_longtitude]
    //         ] ,
    //         DestinationPositions:[
    //             Double[Start_longtitude, Start_longtitude]
    //         ] ,
            
            


            
    //     }
    //     // console.log("locationParams: ", locationParams)

    //     return new Promise((resolve, reject) => {
    //         this.awsLocationService.calculateRouteMatrix(locationParams, function (error, data) {
    //             if (error) {
    //                 console.log(`Search place index to AWS Location has error: ${error}`)
    //                 reject(error as AWS.AWSError)
    //             } else {
    //                 console.log(`Search place index to AWS Location successful: ${JSON.stringify(data)}`)
    //                 console.log("data 1 is : " , data)
    //                 resolve(data as CalculateRouteMatrixResponse)
    //             }
    //         })
    //     })
    // }

    public calculateDistance(la1: number, lo1: number, la2: number, lo2: number) {
        const dLat = (la2 - la1) * (Math.PI / 180);
        const dLon = (lo2 - lo1) * (Math.PI / 180);

        const la1ToRad = la1 * (Math.PI / 180);
        const la2ToRad = la2 * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(la1ToRad) * Math.cos(la2ToRad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return c * 6371;
    }

   
}