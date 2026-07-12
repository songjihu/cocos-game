import { _decorator, Component, Node, instantiate } from 'cc';
import { BaseScene } from './Base/BaseScene';
import { AudioMgr } from './Mgr/AudioMgr';
import { ResMgr } from './Mgr/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('Main')
/**
 * 天天足球主要游戏逻辑
 */
export class Main extends Component {
    //
    public static instance: Main = null;

    //场景父级
    @property({ type: Node })
    private MainLoad: Node | null = null;

    //音乐按钮
    @property(Node)
    private MusicButton: Node | null = null;

    onLoad() {
        Main.instance = this;
    }

    start() {
        this.MusicButton.active = false;
        //音效管理初始化
        AudioMgr.instance.Init();
    }

    /**
     * 更新场景
     * @param 预设场景名称
     */
    public UpdateScene(_sceneprefab: string) {
        //销毁当前场景元素
        for (let i = 0; i < this.MainLoad.children.length; i++) {
            this.MainLoad.children[i].destroy();
        }
        this.MainLoad.addChild(instantiate(ResMgr.instance.Prefabs[_sceneprefab]))
    }


    /**
     * 显示音乐按钮
     */
    public ShowButton() {
        this.MusicButton.active = true;
    }

    /**
     * 音效按钮点击
     */
    public ClickMusic() {
        AudioMgr.instance.PlayEffect("change_music");
        //我在静音的状态
        if (AudioMgr.instance.IsMute) {
            this.MusicButton.getChildByName("mutebutton").active = false;
            AudioMgr.instance.PlayBgSound("bgsound");
        } else {
            this.MusicButton.getChildByName("mutebutton").active = true;
            AudioMgr.instance.StopBgSound();
        }
    }
}

