function State() {
  return {
    games: 0,
    ties: 0,
    wins: [
      0,
      0
    ],
    times: [],
    timeouts: [
      0,
      0
    ]
  };
}

module.exports = State;