import { _decorator, Component, Node, UIOpacity, RigidBody2D, Vec2, Vec3, math } from 'cc';
import { Mycontrol } from '../MycontrolLoad/Mycontrol';
const { ccclass, property } = _decorator;

@ccclass('Ball')
/**
 * 球
 */
export class Ball extends Component {

    //是否显示
    public IsShow: boolean = false;

    //发射速度
    public FireSpeed: number = 50;

    start() {
        this.IsShow = true;
    }

    /**
     * 发射球
     * @param 带球人物
     */
    public Fire(_control: Node) {
        this.getComponent(RigidBody2D).type = 2;
        this.ShowBall(true); // //获取操控人物得位置
        let people_pos: Vec3 = _control.getPosition();
        //获取人物当前角度
        let people_rota: number = (_control.angle - 90) * Math.PI / 180;
        //球和人物之间得间距
        let poeple_dis: number = 100;
        this.node.setPosition(people_pos.add(new Vec3(poeple_dis * Math.cos(people_rota), poeple_dis * Math.sin(people_rota))));
        this.node.getComponent(RigidBody2D).linearVelocity = new Vec2(this.FireSpeed * Math.cos(people_rota), this.FireSpeed * Math.sin(people_rota));
        //操控人物恢复
        _control.getComponent(Mycontrol).FireBall();
    }

    /**
     * 显示小球
     * @param 是否心事
     */
    public ShowBall(_isshow: boolean) {
        this.IsShow = _isshow;
        this.getComponent(UIOpacity).opacity = (_isshow ? 225 : 0)
    }

}

