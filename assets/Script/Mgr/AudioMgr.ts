import { _decorator, Component, Node, AudioSource } from 'cc';
import { ResMgr } from './ResMgr';
const { ccclass, property } = _decorator;

@ccclass('AudioMgr')
/**
 * 音效管理
 */
export class AudioMgr {
    //
    private static _instance: AudioMgr = null;
    //
    public static get instance() {
        if (!this._instance) {
            this._instance = new AudioMgr();
        }
        return this._instance;
    }

    //背景音乐管理
    private BgSound: AudioSource = null;

    //音效管理
    private EffectSound: AudioSource = null;

    //是否是静音状态
    public IsMute: boolean = true;

    /**
     * 初始化
     */
    public Init() {
        this.BgSound = new AudioSource();
        this.EffectSound = new AudioSource();
    }

    /**
     * 播放背景音效
     * @param 背景音效名称
     * @param 背景音效声量
     */
    public PlayBgSound(_bgsoundname: string, _volume: number = 1) {
        this.IsMute = false;
        this.BgSound.clip = ResMgr.instance.Audio[_bgsoundname];
        this.BgSound.play();
        this.BgSound.volume = _volume;
        this.BgSound.loop = true;
    }

    /**
     * 暂停背景音效
     */
    public StopBgSound() {
        this.IsMute = true;
        this.BgSound.stop();
        this.EffectSound.stop();
    }

    /**
     * 播放音效
     * @param 音效名称
     */
    public PlayEffect(_effectname: string) {
        if (!this.IsMute) {
            this.EffectSound.clip = ResMgr.instance.Audio[_effectname];
            this.EffectSound.loop = false;
            this.EffectSound.play();
        }
    }
}

