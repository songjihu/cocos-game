import { _decorator, Component, Node, AssetManager, assetManager, Prefab, Texture2D, SpriteAtlas, SpriteFrame, AudioClip } from 'cc';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('ResMgr')
/**
 * 资源加载管理
 */
export class ResMgr {
    //
    private static _instance: ResMgr = null;
    //
    public static get instance() {
        if (!this._instance) {
            this._instance = new ResMgr();
        }
        return this._instance;
    }

    //包体
    private Bundles = {};

    //预设体数组
    public Prefabs = {}

    //纹理数组
    public SpriteFrames = {};

    //音乐数组
    public Audio = {};

    //当前加载进度
    public NowProgress: number = 0;

    /**
     * 加载包体
     * @param 包体名称
     * @oaran 完成进度
     */
    public async LoadBundle(_bundlename: string, _completeprogress: number = 0) {
        return new Promise<void>((_resolve, _reject) => {
            assetManager.loadBundle(_bundlename, (err, bundle) => {
                if (err) {
                    console.error(_bundlename + "包加载失败", err);
                    _reject && _reject(err);
                    return;
                }
                Global.IsDebug && console.log(_bundlename + "包加载包完成", err, bundle);
                this.Bundles[_bundlename] = bundle;
                Global.LoadProgress += _completeprogress;
                this.NowProgress = Global.LoadProgress;
                _resolve && _resolve();
            })
        })
    }

    /**
     * 加载资源
     * @param 包体名称
     * @param 加载类型
     * @oaran 完成进度
     */
    public async LoadRes(_bundlename: string, _type: any, _completeprogress: number = 0) {
        return new Promise<void>((_resolve, _reject) => {
            this.Bundles[_bundlename].loadDir(_type.path, _type.type, (_fish: number, _total: number) => {
                Global.LoadProgress = _completeprogress * (_fish / _total) + this.NowProgress;
                // Global.IsDebug && console.log("加载" + _bundlename + "包体进度", _type, _fish, _total, Global.LoadProgress);
            }, (_err: any, _assets: any[]) => {
                Global.IsDebug && console.log("加载完成", _assets)

                this.NowProgress = Global.LoadProgress;
                console.warn("当前包资源", this.NowProgress, _type)
                //单个资源
                let asset: any;

                if (_type.type == Prefab) {//预设体
                    for (let i = 0; i < _assets.length; i++) {
                        asset = _assets[i];
                        this.Prefabs[asset.name] = asset;
                        Global.IsDebug && console.log("prefab name==", asset.name)
                    }
                }

                if (_type.type == SpriteFrame) {//纹理
                    for (let i = 0; i < _assets.length; i++) {
                        asset = _assets[i];
                        this.SpriteFrames[asset.name] = asset;
                        Global.IsDebug && console.log("spriteframe name==", asset.name)
                    }
                }

                if (_type.type == AudioClip) {//音效
                    for (let i = 0; i < _assets.length; i++) {
                        asset = _assets[i];
                        this.Audio[asset.name] = asset;
                        Global.IsDebug && console.log("audioclip name==", asset.name)
                    }
                }

                _resolve && _resolve();
            })
        })
    }
}

