import { _decorator, Component, Node, Prefab, Vec2, instantiate, Vec3, spriteAssembler } from 'cc';
import { Global } from '../../Global';
import { GameScene } from '../../Scene/GameScene';
import { Ball } from '../FixLoad/Ball';
import { Mycontrol } from './Mycontrol';
const { ccclass, property } = _decorator;

@ccclass('MycontrolLoad')
/**
 * 我控制人物层
 */
export class MycontrolLoad extends Component {

    //我方球员预设体
    @property({ type: Prefab })
    private Mycontrol: Prefab | null = null;

    //球员数组
    private Mycontrols: Node[] = [];

    //起始球员位置
    public StartPos: Vec3 = new Vec3(0, 430, 0);

    //球
    @property(Node)
    private Ball: Node | null = null;

    start() {

    }

    update(deltaTime: number) {

    }

    /**
     * 发射足球
     */
    public HitBall() {
        for (let i = 0; i < this.Mycontrols.length; i++) {
            if (this.Mycontrols[i].getComponent(Mycontrol).Ball.active) {
                //获取当前球的角度，然后根据角度发射足球
                this.Mycontrols[i].getComponent(Mycontrol).FireBall();
            }
        }
    }

    /**
     * 获取球员
     * @param 位置
     */
    public GetMycontrol(_pos: Vec3) {
        if (this.Mycontrols.length == 0) {
            this.CreateMycontrol(_pos);
        } else {
            let use_num: number = -1;
            for (let i = 0; i < this.Mycontrols.length; i++) {
                if (this.Mycontrols[i].active == false) use_num = i;
            }
            if (use_num == -1) this.CreateMycontrol(_pos);
            else {
                this.Mycontrols[use_num].getComponent(Mycontrol).UpdateStyle();
                this.Mycontrols[use_num].setPosition(_pos);
            }
        }
    }

    /**
     * 创建球员
     * @param 位置
     */
    private CreateMycontrol(_pos: Vec3) {
        let mycontrol: Node = instantiate(this.Mycontrol);
        this.node.addChild(mycontrol);
        mycontrol.setPosition(_pos);
        mycontrol.getComponent(Mycontrol).UpdateStyle();
        this.Mycontrols.push(mycontrol);
    }

    /**
     * 更新关卡
     */
    public UpdateLevel() {
        //销毁所有控制球员
        for (let i = 0; i < this.Mycontrols.length; i++)this.Mycontrols[i].active = false;
        //起始人物
        this.GetMycontrol(this.StartPos);
        //创建关卡人物
        for (let i = 0; i < Global.LevelInfor[Global.NowIndex].mycontrol.length; i++) {
            this.GetMycontrol(new Vec3(Global.LevelInfor[Global.NowIndex].mycontrol[i].x, Global.LevelInfor[Global.NowIndex].mycontrol[i].y, 0))
        };
    }
}

