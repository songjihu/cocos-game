import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Global')
/**
 * 全局数据
 */
export class Global {

    //是否在微信环境中
    static IsWx: boolean = false;

    //是否在测试中返回假数据
    static IsTest: boolean = false;

    //是否在测试环境中
    static IsDebug: boolean = false;

    //加载进度
    static LoadProgress: number = 0;

    //关卡信息
    static Levels = [];

    //当前关卡
    static NowLevel: number = 0;

    //本地过关缓存信息
    static LocalLevel = []

    //缓存key
    static LocalKey = {
        LocalLevel: "LocalLevel"
    }

    //资源包名称
    static BundleName = {
        SubBundle: "sb"
    }

    //预设体名称
    static PrefabName = {
        GameScene: "GameScene",
        LoginScene: "LoginScene"
    }

    //碰撞体名称
    static HitBodyName = {
        Ball: "Ball",
        GoalHit: "GoalHit",
        NoGoal0: "NoGoal0",
        NoGoal1: "NoGoal1",
        Mycontrol: "Mycontrol",
        Denfense: "Denfense",
        GoalKeeper: "GoalKeeper"
    }


    //当前关卡
    static NowIndex: number = 0;

    //关卡信息
    /**
     * 我控制球员得位置
     * 防守球员得位置
     * 
     * 每个关卡有五个球进去三个球算是过关
     */
    static LevelInfor = [
        //第一关
        {
            mycontrol: [],
            denfense: [{ x: 210, y: -37 }, { x: -210, y: -37 }],
            gloalnum: 3,
            surplenum: 5
        },
        //第二关
        {
            mycontrol: [{ x: -200, y: -180 }, { x: 200, y: -180 }],
            denfense: [{ x: -200, y: 100 }, { x: 200, y: 100 }, { x: 0, y: 0 }],
            gloalnum: 4,
            surplenum: 7
        },
        //第三关
        {
            mycontrol: [{ x: -250, y: -115 }, { x: 250, y: -115 }],
            denfense: [{ x: -140, y: 100 }, { x: 140, y: 100 }, { x: 0, y: -250 }],
            gloalnum: 4,
            surplenum: 7
        },
        //第四关
        {
            mycontrol: [{ x: 0, y: -115 }],
            denfense: [{ x: -210 + 50, y: 100 }, { x: -70 + 50, y: 100 }, { x: 84 + 50, y: 100 }],
            gloalnum: 4,
            surplenum: 7
        },
        //第五关
        {
            mycontrol: [{ x: -200, y: -150 }],
            denfense: [
                { x: 200, y: 130 }, { x: 55, y: 130 }, { x: -100, y: 130 }, { x: -250, y: 130 },
                { x: 290, y: -150 }, { x: 140, y: -150 }, { x: -20, y: -150 }
            ],
            gloalnum: 4,
            surplenum: 7
        },
    ]

    /**
     * 道具名称
     */
    static PropName = ["iceicon", "timepropicon"]

}

