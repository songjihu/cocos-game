import { _decorator, Component, Node, ProgressBar, Label, AudioClip, Prefab } from 'cc';
import { BaseScene } from '../Base/BaseScene';
import { Global } from '../Global';
import { Main } from '../Main';
import { AudioMgr } from '../Mgr/AudioMgr';
import { ResMgr } from '../Mgr/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('LoadScene')
/**
 * 加载场景
 */
export class LoadScene extends BaseScene {

    //进度条
    @property({ type: ProgressBar })
    private Progress: ProgressBar | null = null;

    //进度文字
    @property({ type: Label })
    private ProgressText: Label | null = null;

    async start() {
        this.GetLocalStroage();

        ResMgr.instance.NowProgress = 0;
        Global.LoadProgress = 0;

        this.Progress.progress = Global.LoadProgress;
        this.ProgressText.string = "正在加载资源......" + Math.floor(Global.LoadProgress * 100).toString() + "%";

        await ResMgr.instance.LoadBundle(Global.BundleName.SubBundle, 0.1);
        await ResMgr.instance.LoadRes(Global.BundleName.SubBundle, { path: "Prefab", type: Prefab }, 0.5);
        await ResMgr.instance.LoadRes(Global.BundleName.SubBundle, { path: "Audio", type: AudioClip }, 0.4)
        Main.instance.UpdateScene(Global.PrefabName.LoginScene);
    }

    /**
     * 读取用户本数据（json关卡数据和本地缓存数据）
     */
    private GetLocalStroage() {
        Global.LocalLevel = JSON.parse(localStorage.getItem(Global.LocalKey.LocalLevel)) ? JSON.parse(localStorage.getItem(Global.LocalKey.LocalLevel)) : [];
        Global.IsDebug && console.log("本地缓存关卡", Global.LocalLevel)
    }

    update() {
        this.Progress.progress = Global.LoadProgress;
        this.ProgressText.string = "正在加载资源......" + Math.floor(Global.LoadProgress * 100).toString() + "%";
    }

}

