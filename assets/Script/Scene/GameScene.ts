import { _decorator, Component, Node, Input, instantiate, Prefab, RigidBody2D, Vec2, math, Vec3, TiledUserNodeData } from 'cc';
import { DefenseLoad } from '../GameScene/DefenseLoad/DefenseLoad';
import { ElementLoad } from '../GameScene/ElementLoad';
import { Ball } from '../GameScene/FixLoad/Ball';
import { FixLoad } from '../GameScene/FixLoad/FixLoad';
import { Mycontrol } from '../GameScene/MycontrolLoad/Mycontrol';
import { MycontrolLoad } from '../GameScene/MycontrolLoad/MycontrolLoad';
import { Global } from '../Global';
import { AudioMgr } from '../Mgr/AudioMgr';
import { PhysicsMgr } from '../Mgr/PhysicsMgr';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
/**
 * 游戏场景
 */
export class GameScene extends Component {
    //
    public static instance: GameScene = null;

    //我控制人物层
    @property({ type: Node })
    private MycontrolLoad: Node | null = null;
    //防守者层
    @property({ type: Node })
    private DenfensLoad: Node | null = null;
    //固定层
    @property({ type: Node })
    private FixLoad: Node | null = null;
    //元素层
    @property({ type: Node })
    private ElementLoad: Node | null = null;

    //足球
    @property({ type: Node })
    public Ball: Node | null = null;

    //当前控球的人物
    public ControlPeople: Node | null = null;

    //是否是第一次发射
    private IsFirst: boolean = true;

    onLoad() {
        GameScene.instance = this;
    }

    start() {
        PhysicsMgr.instance.Init();
        this.node.on(Input.EventType.TOUCH_START, this.TouchStart, this);

        this.UpdateLevel();
    }

    /**
     * 用户点击屏幕
     */
    private TouchStart() {
        //发射足球 如果球在运动过程中 不执行
        if (this.Ball.getComponent(Ball).IsShow || this.ElementLoad.getComponent(ElementLoad).LevelPrompt.active) return;
        if (this.IsFirst) this.ElementLoad.getComponent(ElementLoad).Surple();
        this.IsFirst = false;
        this.Ball.getComponent(Ball).Fire(this.ControlPeople);
        // this.IamSuccess(); 
        // this.IamFail();
    }


    /**
     * 重置回合
     * @param 是否进球了
     */
    public ResetRound(_isgoal: boolean) {
        Global.IsDebug && console.log("是否进球了", _isgoal);


        AudioMgr.instance.PlayEffect(_isgoal ? "goalsound" : "xusound");

        //无论是否进球都需要重置回合
        this.Ball.setPosition(this.MycontrolLoad.getComponent(MycontrolLoad).StartPos);

        this.IsFirst = true;
        if (_isgoal) {
            this.ElementLoad.getComponent(ElementLoad).Goal();
            this.FixLoad.getComponent(FixLoad).PlayGolaAni();
        }

        //
        this.ElementLoad.getComponent(ElementLoad).AddRoundPrompt(_isgoal);

        //判断游戏是否结束
        let gola_num: number = this.ElementLoad.getComponent(ElementLoad).GoalNum;
        let surple_num: number = this.ElementLoad.getComponent(ElementLoad).SurpleNum;

        //如果进球数量达到了游戏成功
        if (gola_num >= Global.LevelInfor[Global.NowIndex].gloalnum) {
            this.ElementLoad.getComponent(ElementLoad).AddLevelPrompt(true);
            return;
        }

        //如果剩下的球都进了也不能过关直接失败
        if (gola_num + surple_num < Global.LevelInfor[Global.NowIndex].gloalnum) {
            this.ElementLoad.getComponent(ElementLoad).AddLevelPrompt(false);
            return;
        };
    }

    /**
     * 过关更新关卡
     */
    private IamSuccess() {
        if (Global.NowIndex == Global.LevelInfor.length - 1) {
            return;
        }
        Global.NowIndex++;
        this.UpdateLevel();
    }

    /**
     * 过关失败
     */
    private IamFail() {
        this.UpdateLevel();
    }

    /**
     * 更新关卡信息
     */
    private UpdateLevel() {
        this.MycontrolLoad.getComponent(MycontrolLoad).UpdateLevel();
        this.DenfensLoad.getComponent(DefenseLoad).UpdateLevel();
        this.ElementLoad.getComponent(ElementLoad).UpdateLevel();
        this.FixLoad.getComponent(FixLoad).UpdateLevel();

        //重置回合
        this.IsFirst = true;
        this.Ball.getComponent(RigidBody2D).type = 2;
        this.Ball.setPosition(this.MycontrolLoad.getComponent(MycontrolLoad).StartPos);

    }
}

