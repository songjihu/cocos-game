import { _decorator, Component, Node, EventTouch, Input } from 'cc';
import { BaseScene } from '../Base/BaseScene';
import { Global } from '../Global';
import { Main } from '../Main';
import { AudioMgr } from '../Mgr/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('LoginScene')
/**
 * 首页
 */
export class LoginScene extends BaseScene {

    //选取关卡界面
    @property(Node)
    private ChooseBox: Node | null = null;

    start() {
        this.ChooseBox.active = false;
        Main.instance.ShowButton();
        this.node.getChildByName("alphabg").active = false;
        this.node.getChildByName("alphabg").on(Input.EventType.TOUCH_START, () => { })
    }

    /**
     * 点击开始游戏
     */
    private StartClick() {
        AudioMgr.instance.PlayEffect("change_music");
        this.node.getChildByName("alphabg").active = true;
        this.ChooseBox.active = true;
    }

    /**
     * 进入关卡
     */
    private GoGame(_event: EventTouch, _custom: string) {
        this.node.getChildByName("alphabg").off(Input.EventType.TOUCH_START, () => { })
        AudioMgr.instance.PlayEffect("change_music");
        Global.NowIndex = Number(_custom);
        Main.instance.UpdateScene(Global.PrefabName.GameScene);
    }
}

