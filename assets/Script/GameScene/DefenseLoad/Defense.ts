import { _decorator, Component, Node, Sprite, Animation } from 'cc';
import { ResMgr } from '../../Mgr/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('Defense')
/**
 * 防守者
 */
export class Defense extends Component {
    //当前样式名称
    private SpriteFrame: string = "";

    /**
     * 更新人物样式
     */
    public UpdateStyle() {
        this.node.active = true;
        this.name = "Defense";
    }

    /**
    * 播放动画
    */
    public PlayAnimate() {
        this.node.getComponent(Animation).play();
    }
}

