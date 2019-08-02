class PomodoroClock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			breakLength: 5,
			sessionLength: 25,
			timer: 1500,
			timerState: "stopped",
			timerType: "Session"
		};
		this.handleCounter = this.handleCounter.bind(this);

		this.toggleTimer = this.toggleTimer.bind(this);
		this.timerCountdown = this.timerCountdown.bind(this);
		this.resetTimer = this.resetTimer.bind(this);

		this.secondsToMs = this.secondsToMs.bind(this);

		var count = 0;
		var counter;
		var audio;
	}

	componentDidMount() {
		this.audio = document.getElementsByTagName("audio")[0];
		document.getElementsByClassName("fa-play")[0].setAttribute("title", "Play");
	}

	secondsToMs() {
		let minutes = Math.floor(this.state.timer / 60);
		let seconds = this.state.timer - minutes * 60;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		minutes = minutes < 10 ? "0" + minutes : minutes;
		return minutes + ":" + seconds;
	}
	timerCountdown() {
		this.setState({ timer: this.state.timer - 1 });
		if (this.state.timer < 0) {
			clearInterval(this.counter);

			if (this.secondsToMs() == "00:00") {
				this.setState(
					{ timer: "0" }
					// , () => {
					// setTimeout(() => {

					// }, 100000);
				);
			}
			this.audio.play();
			console.log("reached end " + this.secondsToMs());

			// if (this.state.sessionLength == 1) {
			// 	return;
			// }

			if (this.state.timerType === "Session") {
				this.setState(
					{
						timer: this.state.breakLength * 60,
						// sessionLength: this.state.sessionLength - 1,
						timerType: "Break"
					},
					() => {
						//		setTimeout(() => {
						console.log(this.state.timerType);
						this.counter = setInterval(this.timerCountdown, 1000);
						//		}, 1000);
					}
				);
			} else if (this.state.timerType === "Break") {
				this.setState(
					{
						timer: this.state.sessionLength * 60,
						timerType: "Session"
					},
					() => {
						//		setTimeout(() => {
						this.counter = setInterval(this.timerCountdown, 1000);
						//		}, 1000);
					}
				);
			}
			// this.setState({ timer: this.state.timer - 1 });
			// this.counter = setInterval(this.timerCountdown, 1000);
		}
	}

	toggleTimer() {
		if (this.state.timerState == "stopped") {
			this.setState(
				{
					timerState: "running"
				},
				() => {
					this.counter = setInterval(this.timerCountdown, 1000);
				}
			);
			document.getElementById("start_stop").classList.remove("fa-play");
			document.getElementById("start_stop").classList.add("fa-pause");
			document
				.getElementsByClassName("fa-pause")[0]
				.setAttribute("title", "Pause");
		} else {
			this.setState(
				{
					timerState: "stopped"
				},
				() => {
					console.log("changed state to stopped " + this.state.timerState);
					clearInterval(this.counter);
				}
			);

			document.getElementById("start_stop").classList.remove("fa-pause");
			document.getElementById("start_stop").classList.add("fa-play");

			document
				.getElementsByClassName("fa-play")[0]
				.setAttribute("title", "Play");
		}
	}
	resetTimer() {
		clearInterval(this.counter);
		//this.audio.load();
		this.audio.pause();
		this.audio.currentTime = 0;
		console.log("reset");
		this.setState({
			breakLength: 5,
			sessionLength: 25,
			timer: 25 * 60,
			timerState: "stopped",
			timerType: "Session"
		});
	}

	handleCounter(event) {
		if (this.state.timerState == "running") {
			return;
		}
		if (event.target.id == "break-decrement") {
			this.setState({
				breakLength:
					this.state.breakLength > 1
						? this.state.breakLength - 1
						: this.state.breakLength
			});
		} else if (event.target.id == "break-increment") {
			this.setState({
				breakLength:
					this.state.breakLength < 60
						? this.state.breakLength + 1
						: this.state.breakLength
			});
		} else if (event.target.id === "session-decrement") {
			this.setState(
				{
					sessionLength:
						this.state.sessionLength > 1
							? this.state.sessionLength - 1
							: this.state.sessionLength
				},
				() => {
					if (this.state.sessionLength > 0) {
						this.setState({
							timer: this.state.sessionLength * 60
						});
					}
				}
			);
		} else if (event.target.id === "session-increment") {
			this.setState(
				{
					sessionLength:
						this.state.sessionLength < 60
							? this.state.sessionLength + 1
							: this.state.sessionLength
				},
				() => {
					if (this.state.sessionLength <= 60) {
						this.setState({
							timer: this.state.sessionLength * 60
						});
					}
				}
			);
		}
	}

	render() {
		return (
			<div className="wrapper">
				<audio id="beep">
					<source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1277657/Zen%20Buddhist%20Temple%20Bell-SoundBible.com-331362457.wav" />
					Your browser isn't invited for super fun audio time.
				</audio>

				<h1>Pomodoro Clock</h1>

				<div id="break-container">
					<div id="break-label">Break Length</div>
					<span onClick={this.handleCounter}>
						<i
							className="fa fa-arrow-up"
							aria-hidden="true"
							id="break-increment"
						/>
					</span>
					&emsp;<span id="break-length">{this.state.breakLength}</span>
					&emsp;
					<span onClick={this.handleCounter}>
						<i
							className="fa fa-arrow-down"
							aria-hidden="true"
							id="break-decrement"
						/>
					</span>
				</div>

				<div id="session-container">
					<div id="session-label">Session Length</div>
					<span onClick={this.handleCounter}>
						<i
							className="fa fa-arrow-up"
							aria-hidden="true"
							id="session-increment"
						/>
					</span>
					&emsp;<span id="session-length">{this.state.sessionLength}</span>
					&emsp;
					<span onClick={this.handleCounter}>
						<i
							className="fa fa-arrow-down"
							aria-hidden="true"
							id="session-decrement"
						/>
					</span>
				</div>

				<div id="timer-container">
					<div id="timer-label">{this.state.timerType}</div>
					<div id="time-left">{this.secondsToMs()}</div>
				</div>
				<div id="clock-controls">
					<span onClick={this.toggleTimer}>
						<i
							className="fa fa-play fa-2x"
							aria-hidden="true"
							id="start_stop"
						/>
					</span>
					<span onClick={this.resetTimer}>
						<i
							className="fa fa-refresh fa-2x"
							title="reset"
							aria-hidden="true"
							id="reset"
						/>
					</span>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<PomodoroClock />, document.getElementById("App"));
