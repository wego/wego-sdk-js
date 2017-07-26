var sorting = require('../../src/flight-search/sorting');

describe('sorting', function() {

  it('sorting by price', function() {
    var trip1 = {
      id: 1,
      fares: [
        {
          price: {
            amountUsd: 1
          },
        }
      ]
    };

    var trip2 = {
      id: 2,
      fares: [
        {
          price: {
            amountUsd: 3
          },
        }
      ]
    };

    var trip3 = {
      id: 3,
      fares: [
        {
          price: {
            amountUsd: 2
          },
        }
      ]
    };

    var trips = sorting.sortTrips([trip1, trip2, trip3], {
      by: 'PRICE',
      order: 'ASC',
    });
    expect(trips).to.deep.equal([trip1, trip3, trip2]);
  });


  it('sorting by duration minutes', function() {
    var trip1 = {
      durationMinutes: 2,
      fares: [createFare(3)],
      legs: [createLeg(1), createLeg(1)],
    };

    var trip2 = {
      durationMinutes: 4,
      legs: [createLeg(2), createLeg(2)],
    };

    var trip3 = {
      durationMinutes: 2,
      fares: [createFare(5)],
      legs: [createLeg(1), createLeg(1)],
    };

    var trip4 = {
      durationMinutes: 3,
      legs: [createLeg(2), createLeg(1)],
    };

    var trips = sorting.sortTrips([trip1, trip2, trip3, trip4], {
      by: 'DURATION',
      order: 'DESC',
    });

    expect(trips).to.deep.equal([trip2, trip4, trip1, trip3]);
  });

  it('sorting by outbound departure time', function() {
    var trip1 = createTrip({
      legs: [
        {
          departureTimeMinutes: 1
        }
      ]
    });

    var trip2 = createTrip({
      legs: [
        {
          departureTimeMinutes: 3
        }
      ]
    });

    var trip3 = createTrip({
      legs: [
        {
          departureTimeMinutes: 2
        }
      ]
    });

    var trips = sorting.sortTrips([trip1, trip2, trip3], {
      by: 'OUTBOUND_DEPARTURE_TIME',
      order: 'ASC',
    });

    expect(trips).to.deep.equal([trip1, trip3, trip2]);
  });

  it('sorting by inbound departure time', function() {
    var trip1 = createTrip({
      legs: [
        {},
        {
          departureTimeMinutes: 1
        }
      ]
    });

    var trip2 = createTrip({
      legs: [
        {},
        {
          departureTimeMinutes: 3
        }
      ]
    });

    var trip3 = createTrip({
      legs: [
        {},
        {
          departureTimeMinutes: 2
        }
      ]
    });

    var trips = sorting.sortTrips([trip1, trip2, trip3], {
      by: 'INBOUND_DEPARTURE_TIME',
      order: 'ASC',
    });

    expect(trips).to.deep.equal([trip1, trip3, trip2]);
  });

  it('sorting by outbound arrival time', function() {
    var trip1 = createTrip({
      legs: [
        {
          arrivalTimeMinutes: 1,
          durationDays: 0
        }
      ]
    });

    var trip2 = createTrip({
      legs: [
        {
          arrivalTimeMinutes: 3,
          durationDays: 0
        }
      ]
    });

    var trip3 = createTrip({
      legs: [
        {
          arrivalTimeMinutes: 2,
          durationDays: 0
        }
      ]
    });

    var trips = sorting.sortTrips([trip1, trip2, trip3], {
      by: 'OUTBOUND_ARRIVAL_TIME',
      order: 'ASC',
    });

    expect(trips).to.deep.equal([trip1, trip3, trip2]);
  });

    it('sorting by outbound arrival time when there is overnight flight', function() {
    var trip1 = createTrip({
      legs: [
        {
          arrivalTimeMinutes: 1,
          durationDays: 1,
        }
      ]
    });

    var trip2 = createTrip({
      legs: [
        {
          arrivalTimeMinutes: 3,
          durationDays: 0,
        }
      ]
    });

    var trips = sorting.sortTrips([trip1, trip2], {
      by: 'OUTBOUND_ARRIVAL_TIME',
      order: 'ASC',
    });

    expect(trips).to.deep.equal([trip2, trip1]);
  });

  it('sorting by inbound arrival time', function() {
    var trip1 = createTrip({
      legs: [
        {},
        {
          arrivalTimeMinutes: 1,
          durationDays: 0
        }
      ]
    });

    var trip2 = createTrip({
      legs: [
        {},
        {
          arrivalTimeMinutes: 3,
          durationDays: 0
        }
      ]
    });

    var trip3 = createTrip({
      legs: [
        {},
        {
          arrivalTimeMinutes: 2,
          durationDays: 0
        }
      ]
    });

    var trips = sorting.sortTrips([trip1, trip2, trip3], {
      by: 'INBOUND_ARRIVAL_TIME',
      order: 'ASC',
    });

    expect(trips).to.deep.equal([trip1, trip3, trip2]);
  });

  it('sorting by score', function() {
    var trip1 = { score: 1 };
    var trip2 = { score: 3 };
    var trip3 = { score: 2};

    var trips = sorting.sortTrips([trip1, trip2, trip3], {
      by: 'SCORE',
      order: 'ASC',
    });

    expect(trips).to.deep.equal([trip1, trip3, trip2]);
  });

  it('#getCheapesttrip', function() {
    var trip1 = {
      id: 1,
      fares: [
        {
          price: {
            amountUsd: 4
          },
        }
      ]
    };

    var trip2 = {
      id: 2,
      fares: [
        {
          price: {
            amountUsd: 3
          },
        }
      ]
    };

    var trip3 = {
      id: 3,
      fares: [
        {
          price: {
            amountUsd: 2
          },
        }
      ]
    };

    expect(sorting.getCheapestTrip([trip1, trip2, trip3])).to.equal(trip3);
  });

  it('#getFastesttrip', function() {
    var trip1 = {
      id: 1,
      durationMinutes: 4,
      legs: [createLeg(2), createLeg(2)],
    };

    var trip2 = {
      id: 2,
      durationMinutes: 3,
      fares: [
        {
          price: {
            amountUsd: 2,
          }
        }
      ],
      legs: [createLeg(2), createLeg(1)],
    };

    var trip3 = {
      id: 3,
      durationMinutes: 5,
      legs: [createLeg(3), createLeg(2)],
    };

    var trip4 = {
      id: 4,
      durationMinutes: 3,
      fares: [
        {
          price: {
            amountUsd: 1,
          }
        }
      ],
      legs: [createLeg(2), createLeg(1)],
    };

    expect(sorting.getFastestTrip([trip1, trip2, trip3, trip4])).to.equal(trip4);
  });

  it('getBestExperienceTrip', function() {
    var trip1 = {
      id: 1,
      score: 4,
    };

    var trip2 = {
      id: 2,
      score: 3,
    };

    var trip3 = {
      id: 3,
      score: 5,
      fares: [
        {
          price: {
            amountUsd: 2,
          }
        }
      ]
    };

    var trip4 = {
      id: 4,
      score: 5,
      fares: [
        {
          price: {
            amountUsd: 1,
          }
        }
      ]
    };

    expect(sorting.getBestExperienceTrip([trip1, trip2, trip3, trip4])).to.equal(trip4);
  });

  it('creating object', function() {
    var trip1 = {
      durationMinutes: 2,
      fares: [createFare(3)],
      legs: [createLeg(1), createLeg(1)],
    };

    var trip2 = {
      durationMinutes: 4,
      legs: [createLeg(2), createLeg(2)],
    };

    var trip3 = {
      durationMinutes: 2,
      fares: [createFare(5)],
      legs: [createLeg(1), createLeg(1)],
    };

    var trip4 = {
      durationMinutes: 3,
      legs: [createLeg(1), createLeg(2)],
    };

    var trips = [trip1, trip2, trip3, trip4];

    var sortedTrips = sorting.sortTrips(trips, {
      by: 'DURATION',
      order: 'DESC',
    });

    expect(sortedTrips).to.deep.equal([trip2, trip4, trip1, trip3]);

    expect(sortedTrips).to.not.equal(trips);
  });

  function createTrip(trip) {
    return Object.assign({
      fares: [createFare(1)],
    }, trip);
  }

  function createFare(amountUsd) {
    return {
      price: {
        amountUsd: amountUsd,
      }
    }
  }

  function createLeg(durationMinutes) {
    return {
      durationMinutes: durationMinutes
    }
  }
});