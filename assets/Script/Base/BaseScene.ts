import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseScene')
/**
 * 基础场景
 */
export class BaseScene extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    /**
     * 场景销毁
     */
    public SceneDestory() {
        
    }
}

