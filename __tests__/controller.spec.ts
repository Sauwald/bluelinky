/* eslint-disable */
import got from 'got';

import { AmericanController } from '../lib/controllers/american.controller';
import { EuropeanController } from '../lib/controllers/european.controller';
import { CanadianController } from '../lib/controllers/canadian.controller';

jest.mock('got');

const getController = region => {
  const referenceMap = {
    US: AmericanController,
    EU: EuropeanController,
    CA: CanadianController,
  };

  const controller = new referenceMap[region]({
    username: 'testuser@gmail.com',
    password: 'test',
    region: 'US',
    autoLogin: true,
    pin: '1234',
    vin: '4444444444444',
    vehicleId: undefined,
    deviceUuid: '',
  });

  return controller;
};

describe('AmericanController', () => {
  it('call getVehicles and check length', async () => {
    const controller = getController('US');

    (got as any).mockReturnValueOnce({
      body: JSON.stringify({
        enrolledVehicleDetails: [
          {
            vehicleDetails: [
              {
                nickname: 'Jest is best',
                vin: '444',
                regDate: 'test',
                brandIndicator: 'H',
                regId: '123123',
                gen: '2',
                name: 'Car',
              },
            ],
          },
        ],
      }),
      statusCode: 200,
    });

    expect(await controller.getVehicles()).toHaveLength(1);
  });
});

describe('EuropeanController', () => {

  it('call getVehicles and check length', async () => {
    const controller = getController('EU');

    (got as any).mockReturnValueOnce({
      body: {
        resMsg: {
          vehicles: [
            {
              nickname: 'Jest is best',
              vin: '444',
              regDate: 'test',
              brandIndicator: 'H',
              regId: '123123',
              gen: '2',
              name: 'Car',      
            },
          ],
        },
      },
      statusCode: 200,
    });
    
    (got as any).mockReturnValueOnce({
      body: {
        resMsg: {
          vinInfo: [
            { 
              basic: {
                modelYear: '2019',
                vin: '5555'
              }
            }
          ],
        },
      },
      statusCode: 200,
    });

    const vehicles = await controller.getVehicles();
    expect(vehicles).toHaveLength(1);
  });
});

describe('CanadianController', () => {

  it('call getVehicles and check length', async () => {    
    const controller = getController('CA');

    (got as any).mockReturnValueOnce({
      body: {
        responseHeader: {
          responseCode: 0,
        },
        result: {
          vehicles: [
            {
              nickname: 'Jest is best',
              vin: '444',
              regDate: 'test',
              brandIndicator: 'H',
              regId: '123123',
              gen: '2',
              name: 'Car',
            },
          ],
        },
      },
      statusCode: 200,
    });

    expect(await controller.getVehicles()).toHaveLength(1);
  });
});
