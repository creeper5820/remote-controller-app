import { RTCPeerConnection } from 'react-native-webrtc'

export const webrtc = {
	playUrlInput: '',
	talkUrlInput: '',
	pc: new RTCPeerConnection({
		iceServers: [
			{
				urls: ['stun:stun.voipbuster.com:3478'] //stun:stun.oss.aliyuncs.com:3478
			}
		]
	}),
	pcTalk: new RTCPeerConnection({
		iceServers: [{
			urls: ['stun:stun.voipbuster.com:3478'] //stun:stun.oss.aliyuncs.com:3478
		}]
	}),
	localSDP: null,
	candidateSDP: '',
	remoteVideo: null,
	callButtonDisabled: false,
	hangupButtonDisabled: true,
	startTalkButtonDisabled: false,
	stopTalkButtonDisabled: true,
	iceCandidateCount: 0,
	iceCandidateCountOK: 0,
	hasLocalIP: false,
	phoneType: '',
	phoneSys: '',
	isH264: '',
	remoteAudio: null,
	connectionState: false,
	remoteStream: null,
	isLocalIP(ip) {
		// 检查IP地址是否是内网地址
		// 排除私有地址范围
		if (
			/^10\./.test(ip) || // 10.x.x.x
			/^192\.168\./.test(ip) || // 192.168.x.x
			/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) // 172.16.x.x - 172.31.x.x
		) {
			return true
		}

		// 排除保留地址
		if (
			/^127\./.test(ip) || // 127.x.x.x (loopback)
			/^169\.254\./.test(ip) // 169.254.x.x (link-local)
			// 还可以添加其他保留地址的检查，如多播地址等
		) {
			return true
		}
		if (ip.length > 15) {
			return true
		}
		// 其他条件下认为是公网地址
		return false
	},
	initWebRtc() {

		let _that = this
		let _tracks = [];


		console.log('url  ', _that.playUrlInput)
		_that.pc.onicecandidate = function (event) {
			_that.handleCandidate(event, _that.playUrlInput);
		};
		_that.pc.onicecandidateerror = function (event) {
		};
		_that.pc.ontrack = function (event) {

			if (event.track.kind === 'audio') {
				// 处理音频流
				console.log('audio:');
			} else if (event.track.kind === 'video') {
				// 处理视频流
				console.log('video:');
			}
			_that.hangupButtonDisabled = false;
			_that.hangupVideoButton = false
			_tracks.push(event.track);
			if (event.streams && event.streams.length > 0) {
				let eventStream = event.streams[0];
				eventStream.getTracks().forEach(track => {
					if (track.kind === 'audio') {
						console.log('This is an audio track length', event.streams.length);
					} else if (track.kind === 'video') {
						console.log('This is a video track length', event.streams.length);
					}
				})
				_that.remoteStream = eventStream;

			} else {
				if (_that.pc.getReceivers().length === this._tracks.length) {
					console.log('play remote stream ');
					_remoteStream = new MediaStream(this._tracks);
					_that.remoteStream = this._remoteStream;
				} else {
					console.log('wait stream track finish');
				}
			}
		};
		_that.pc.onconnectionstatechange = function (event) {
			_that.connectionState = event.currentTarget.connectionState;
			console.log('当前状态==>', event.currentTarget.connectionState);
		};

		_that.pcTalk.ontrack = function (event) {
			if (!_that.remoteAudio) {
				// _that.remoteAuido = _that.$refs.audio
				// _that.remoteAuido = uni.createInnerAudioContext()
				_that.remoteAudio = document.getElementsByTagName('video')[1];//
			}
			if (_that.remoteAudio && event.streams && event.streams.length > 0) {
				console.log(_that.remoteAudio)
				let eventStream = event.streams[0];
				// _that.remoteAuido.srcObject = eventStream;
				_that.remoteAudio.srcObject = eventStream;
			} else {
				console.log('pcTalk wait stream track finish');
			}
		};
	},
	handleCandidate(event, url) {
		if (event.candidate) {
			this.iceCandidateCount++; // 每收到一个候选都增加计数
			console.log('Remote ICE candidate: \r\n ' + event.candidate.candidate + '\r\niceCandidateCount' + this.iceCandidateCount);
			const candidateIP = event.candidate.candidate.split(' ')[4] // 提取ICE候选中的IP地址
			this.hasLocalIP = this.isLocalIP(candidateIP)
			if (!this.hasLocalIP) {//过滤掉无效的，比如.local这种会导致服务设置candidate失败
				if (this.candidateSDP) {
					this.candidateSDP += 'a=' + event.candidate.candidate + '\r\n'
				} else {
					this.candidateSDP = 'a=' + event.candidate.candidate + '\r\n'
				}
				this.iceCandidateCountOK++;
				if (this.iceCandidateCountOK === 1) {
					if (this.localSDP) {
						let searchStringAudio = 'm=audio';
						let indexAudio = this.localSDP.indexOf(searchStringAudio);
						let searchStringVideo = 'm=video';
						let indexVideo = this.localSDP.indexOf(searchStringVideo);
						let indexPos = 0;
						if (indexVideo > indexAudio) {
							indexPos = indexVideo;
						} else {
							indexPos = indexAudio;
						}
						this.localSDP = this.localSDP.substring(0, indexPos) + this.candidateSDP + this.localSDP.substring(indexPos);
					}
					//candidateSDP=null;
				}
				if (this.iceCandidateCountOK >= 2) {
					console.log('ICE negotiation finished. All ICE candidates have been done.', url);
					// // Send the candidate to the remote peer
					//this.localSDP.replace(/a=ice-options:trickle/g, '');
					let searchString = 'a=ice-options:trickle';
					if (this.localSDP) {
						let index = this.localSDP.indexOf(searchString);//去掉a=ice-options:trickle，candidate和sdp一起发
						this.localSDP = this.localSDP.substring(0, index) + this.localSDP.substring(index + searchString.length + 2);
						index = this.localSDP.indexOf(searchString);//去掉a=ice-options:trickle，candidate和sdp一起发
						this.localSDP = this.localSDP.substring(0, index) + this.localSDP.substring(index + searchString.length + 2);
						this.localSDP += this.candidateSDP;
						console.log('localSDP:', this.localSDP);
						// this.localSDP.includes('H264') ? (this.isH264 = '是') : (this.isH264 = '否')
						this.doCall(this.localSDP, url);
						this.candidateSDP = null;
						this.localSDP = null;
						this.iceCandidateCountOK = 0;
						this.iceCandidateCount = 0;
					} else {
						console.log('不支持webrtc')
					}
				}
			}
		}
	},
	call() {
		this.callButtonDisabled = true;
		let AudioTransceiverInit = null;
		const VideoTransceiverInit = {
			direction: 'sendrecv',//recvonly
			sendEncodings: []
		};

		this.pc.addTransceiver('video', VideoTransceiverInit);
		{
			AudioTransceiverInit = {
				direction: 'sendrecv'//recvonly
			};
			this.pc.addTransceiver('audio', AudioTransceiverInit);//这样会触发两次onicecandidate
		}

		this.pc.createOffer().then(desc => {
			console.log('--------------offer:', desc.sdp);
			this.pc.setLocalDescription(desc).then(() => {
				console.log('set local description');
				this.localSDP = desc.sdp;
			}).catch(e => {
				console.log('set local description error', e);
			});
		}).catch(e => {
			console.log('create offer error', e);
		});
	},
	setTalkEnable() {
		console.log('startTalk');
		let _that = this
		let talkURL = this.talkUrlInput;
		this.pcTalk.onicecandidate = function (event) {
			_that.handleCandidate(event, talkURL);
		};
		this.pcTalk.onicecandidateerror = function (event) {
			//console.log('onicecandidateerror');
		};
		this.pcTalk.onconnectionstatechange = function (event) {
			console.log('对讲状态==>', event.currentTarget.connectionState);
		};
		let searchStringVideoCall = 'videoCall';
		let indexVideoCall = talkURL.indexOf(searchStringVideoCall);
		if (indexVideoCall <= 0) {//语音对讲
			navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {//后续考虑使用同步阻塞的
				console.log('getUserMedia audio');//const userMedia = navigator.mediaDevices.getUserMedia({ audio: true });
				_that.pcTalk.addTransceiver('video', { direction: 'sendrecv' });//sendrecv
				_that.pcTalk.addTransceiver(stream.getTracks()[0], { direction: 'sendrecv' });
				_that.SetTalkLocalOffer();
			})
				.catch(function (error) {
					console.log('getUserMedia audio err', error);
				});
		} else {//音视频对讲
			navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
				console.log('getUserMedia audio video');
				_that.pcTalk.addTransceiver(stream.getVideoTracks()[0], { direction: 'sendrecv' });//音视频对讲可参考
				_that.pcTalk.addTransceiver(stream.getAudioTracks()[0], { direction: 'sendrecv' });
				_that.SetTalkLocalOffer();
			})
				.catch(function (error) {
					console.log('getUserMedia audio video err', error);
				});
		}
	},
	setTalkDisable() {
		console.log('stopTalk');
		this.pcTalk.close();
		//pcTalk = null;//不注释会报错
		this.stopTalkButtonDisabled = true;
		this.startTalkButtonDisabled = false;

		this.stopTalkButton = true
		this.startTalkButton = false
	},
	SetTalkLocalOffer() {
		this.pcTalk.createOffer().then(desc => {
			console.log('pcTalk.createOffer');
			this.pcTalk.setLocalDescription(desc).then(() => {
				//console.log('pcTalk.setLocalDescription',desc.sdp);
				this.localSDP = desc.sdp;
			});
		}).catch(e => {
			console.log(e);
		});
		this.stopTalkButtonDisabled = false;
		this.startTalkButtonDisabled = true;

		this.stopTalkButton = false
		this.startTalkButton = true
	},
	hangup() {
		console.log('Ending call');
		this.pc.close();
		//pc = null;//不注释会报错
		this.hangupButtonDisabled = true;
		this.callButtonDisabled = false;


		this.hangupVideoButton = true
	},
	doCall(param, url) {
		let playUrl = url
		if (playUrl == this.talkUrlInput) {
			this.TalkNegotiateSDP(param, url);
		}
		else {
			this.NegotiateSDP(param, url);
		}
	},
	NegotiateSDP(param, url) {
		let json = {
			"action": "offer",
			"sdp": param,
		}
		// let jsonStr = JSON.stringify(json);
		//console.log(jsonStr)
		let playUrl = url
		console.log('url--', playUrl)
		//var playUrl = "http://139.9.149.150:9018/test/202404h264g711a.flv.webrtc";//test 2024h264aac.h264 2024h264g711a.flv
		let xhr = new XMLHttpRequest();
		let _that = this
		xhr.onreadystatechange = function () {
			console.log('xhr readyState', xhr.readyState);
			//alert(xhr.status);
			if (xhr.readyState == 4) {
				console.log('xhr status', xhr.status);
				if (xhr.status == 200 || xhr.status == 304) {
					let data = xhr.responseText;
					let jsonstr = JSON.parse(data)
					console.log(jsonstr);
					let anwser = {};
					anwser.sdp = jsonstr.sdp;
					anwser.type = 'answer';
					console.log('answer:', jsonstr.sdp);
					_that.pc.setRemoteDescription(anwser).then(() => {
						console.log('NegotiateSDP pc set remote sucess');
						// 每隔30秒发送一次心跳请求
						_that.GetPlayStatus();//一次就够，维持长链接
					}).catch(e => {
						console.log(e);
					});
				}
			}
		}
		xhr.open("POST", playUrl, true);
		//如果是POST请求方式，设置请求首部信息
		xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
		//xhr.setRequestHeader("Connection","Keep-Alive");
		xhr.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, ClientType,Accept-Encoding,Content-Type,Access-Token,Authorization,authorization,Token,Tag,Cache-Control");
		xhr.setRequestHeader("Accessol-Allow-Origin", "*");
		let jsonStr = JSON.stringify(json);
		xhr.send(jsonStr);
	},
	TalkNegotiateSDP(param, url)//因为要创建一个新的http链接，所以需要新的函数
	{
		let json = {
			"action": "offer",
			"sdp": param,
		}
		let _that = this
		//var jsonStr = JSON.stringify(json);
		//console.log(jsonStr)
		let playUrl = url
		//var playUrl = "https://139.9.149.150:9031/testTalk/202404h264g711a.flv.webrtc"//暂时使用9031这样不同的端口代理实现不复用一个socket
		let xhrTalk = new XMLHttpRequest();//这样还是对讲和预览还是会复用一个socket，会导致服务出错，除非修改服务架构，根据不同的url创建不同的session
		xhrTalk.onreadystatechange = function () {
			console.log('xhrTalk readyState', xhrTalk.readyState);
			if (xhrTalk.readyState == 4) {
				if (xhrTalk.status == 200 || xhrTalk.status == 304) {
					let data = xhrTalk.responseText;
					let jsonstr = JSON.parse(data)
					console.log(jsonstr);
					let anwser = {};
					anwser.sdp = jsonstr.sdp;
					anwser.type = 'answer';
					console.log('answer:', jsonstr.sdp);
					_that.pcTalk.setRemoteDescription(anwser).then(() => {
						console.log('TalkNegotiateSDP pc set remote sucess');
						// 每隔30秒发送一次心跳请求
						//setInterval(sendTalkHeartbeat, 30000)
						_that.GetTalkStatus();//一次就够，维持长链接
					}).catch(e => {
						console.log(e);
					});
				}
			}
		}
		xhrTalk.open("POST", playUrl, true);
		//如果是POST请求方式，设置请求首部信息
		xhrTalk.setRequestHeader("Content-type", "application/json; charset=utf-8");
		//xhrTalk.setRequestHeader("Connection","Keep-Alive");
		xhrTalk.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, ClientType,Accept-Encoding,Content-Type,Access-Token,Authorization,authorization,Token,Tag,Cache-Control");
		xhrTalk.setRequestHeader("Accessol-Allow-Origin", "*");
		let jsonStr = JSON.stringify(json);
		xhrTalk.send(jsonStr);
	},
	GetPlayStatus() {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', this.playUrlInput, true);
		xhr.setRequestHeader("Accessol-Allow-Origin", "*");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200 || xhr.status === 204) {
					// 收到服务器响应，连接仍然活跃
					console.log('PlayStatus(exit) OK ,status:' + xhr.status + ' msg:' + xhr.statusText);
				} else {
					// 连接出现问题，处理断开连接的逻辑
					console.log('PlayStatus err,code:' + xhr.status + ' msg:' + xhr.statusText);
				}
			}
		};
		xhr.send();
	},
	GetTalkStatus() {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', this.talkUrlInput, true);
		xhr.setRequestHeader("Accessol-Allow-Origin", "*");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200 || xhr.status === 204) {
					// 收到服务器响应，连接仍然活跃
					console.log('TalkStatus(exit) OK ,status:' + xhr.status + ' msg:' + xhr.statusText);
				} else {
					// 连接出现问题，处理断开连接的逻辑sendTalkHeartbeat
					console.log('TalkStatus err,code:' + xhr.status + ' msg:' + xhr.statusText);
				}
			}
		};
		xhr.send();
	},
}

// export default webrtc