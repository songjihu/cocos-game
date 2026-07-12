import { _decorator, Component, Node, Sprite, Animation, TERRAIN_HEIGHT_BASE } from 'cc';
import { Global } from '../../Global';
import { ResMgr } from '../../Mgr/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('Mycontrol')
/**
 * 我控制的人物
 */
export class Mycontrol extends Component {

    //当前样式名称
    private SpriteFrame: string = "";


    @property({ type: Node })
    public Ball: Node | null = null;

    //旋转速度
    private AngleSpeed: number = 1;
    private FixSpeed: number = 2;

    //角度边界
    private AngleBuider: { min: number, max: number } = { min: -45, max: 45 };

    start() {

    }

    /**
     * 更新人物样式
     */
    public UpdateStyle() {
        this.node.active = true;
        this.Ball.active = false;
        this.node.angle = 0;
        this.name = Global.HitBodyName.Mycontrol;
    }

    /**
     * 播放动画
     */
    public PlayAnimate() {
        this.node.getComponent(Animation).play();
    }

    /**
     * 碰到了足球
     */
    public HitBall() {
        this.Ball.active = true;
        this.AngleSpeed = this.FixSpeed;
    }

    /**
     * 发射足球
     */
    public FireBall() {
        this.Ball.active = false;
        this.node.angle = 0;
        this.PlayAnimate();
    }

    /**
     * 帧事件
     */
    update() {
        if (this.Ball.active) {
            this.node.angle += this.AngleSpeed;

            if (this.node.angle < this.AngleBuider.min) {
                this.AngleSpeed = this.FixSpeed;
            } else if (this.node.angle > this.AngleBuider.max) {
                this.AngleSpeed = -this.FixSpeed;
            }

        }
    }
}

