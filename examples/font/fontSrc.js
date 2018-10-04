/**
 * @file 一些方便操纵Canvas 2D API绘制的逻辑
 */

import { Box2, Vector2 } from 'three';


/**
 * 2D Context 默认绘图样式的定义
 * font style: normal | italic | oblique | inherit
 * font weight: normal | bold | bolder | lighter | auto
 * font size: A size in pixels e.g 12px, 20px etc.
 * font face: A font face (family), e.g. verdana, arial, serif, sans-serif, cursive, fantasy, monospace etc.
  */
let DefaultCanvasStyle = {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 20,
    fontFace: 'Arial',
    fontColor: '#000000', // 'black', 'rgb(0,0,255)', 'rgba(...)'
    fontAlign: 'start', // "left" || "right" || "center" || "start" || "end"
    fontVAlign: 'top', // "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom"
    borderColor: { r: 0, g: 0, b: 0, a: 1.0 }, // stroke color
    outterInset: 1 // 文字上下左右周边留白间距
};

/**
 * @typedef {Object} Canvas2DWrapper.CanvasBlockInfo
 * @property {string} text - 文字内容
 * @property {number} line - 在第几行
 * @property {THREE.Box2} rect - 坐标及范围，已包含了文字周边的间距
 * @inner
 */

/**
  * 封装了一个隐藏的2D Canvas document element，可以利用它在后台绘制文字图集
  * TODO: 后续优化：如果一帧里没有画新的字，那么纹理不需要更新
  */
class Canvas2DWrapper {

    /**
     * @param {number} [width=512] - default size of the canvas
     * @param {number} [height=512]
     */
    constructor(width = 512, height = 512) {
        let canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
        canvas.width = width;
        canvas.height = height;

        canvas.style.position = 'absolute';
        canvas.style.border = '1px solid';
        canvas.style.zIndex = 8;
        let body = document.getElementsByTagName('body')[0];
        body.appendChild(canvas);

        /**
         * 图集填充的信息记录，从上至下，从左至右逐渐填充
         * @type {Canvas2DWrapper.CanvasBlockInfo[]}
         */
        this._atlasInfo = [];

        this._ctx2d = canvas.getContext('2d');

        this._lines = [];

        this.setDefaultFontStyle();
    }

    /**
     * @returns {[number, number]} 画布尺寸大小（像素）
     */
    get canvasSize() {
        if (this._ctx2d) return [this._ctx2d.canvas.width, this._ctx2d.canvas.height];
        return [0, 0];
    }

    /**
     * 设置绘制文字所用的默认画笔风格，设置一次之后会自动记录在Canvas context2d的state中
     */
    setDefaultFontStyle() {
        /* eslint-disable no-unused-vars */
        let style = DefaultCanvasStyle;
        // font格式：[font style][font weight][font size][font face]
        this._ctx2d.font = `${DefaultCanvasStyle.fontStyle} ${DefaultCanvasStyle.fontWeight} ${style.fontSize}px ${style.fontFace}`;

        let c = style.borderColor;
        this._ctx2d.strokeStyle = `rgba(${c.r},${c.g},${c.b},${c.a})`;

        this._ctx2d.fillStyle = style.fontColor;

        this._ctx2d.textAlign = style.fontAlign;

        this._ctx2d.textBaseline = style.fontVAlign;

        // 前提：所有文字的高度都一样的
        this._fontHeight = parseInt(this._ctx2d.font.match(/\d+/), 10);
    }

    /**
     * 查找图集中的某个字符串的UV信息
     *
     * @param {string} text
     */
    findTextInfo(text) {
        if (!text || text === '') return null;
        for (let info of this._atlasInfo) {
            if (text === info.text) return info;
        }
        return null;
    }

    /**
     * 文字自动按照其尺寸在画布上从左至右、从上至下排列
     * 注意：目前的算法只支持相同size的文字，即每一行的高度相同
     *
     * Your base UVs exist on a unit rectangle: range from 0 to 1
        (0, 1)            (1, 1)
        +-----------------+
        |                 |
        |                 |
      V |                 | 这个UV坐标是THREE.WebGLSpriteRenderer在绘制Sprite时定义好的
        |                 |
        |                 |
        |                 |
        +-----------------+
        (0, 0)    U       (1, 0)

     * You're trying to map that space to a different rectangle on the atlas:
        (xmin, ymax)  (xmax, ymax)
        +------------+
        |            |
        |            |
        |            |
        |            |
        +------------+
        (xmin, ymin)  (xmax, ymin)

     * @param {string} text - 待绘制的文字
     * @returns {boolean} 是否绘制成功
     */
    drawText(text, fontSize = 20) {
        if (!text || text === '') return false;

        let info = this.findTextInfo(text);
        let origin = info ? info.rect.min : null;

        // 此处重新设置字体大小，暂时未找到单独设置字体的地方
        this._ctx2d.font = `${DefaultCanvasStyle.fontStyle} ${DefaultCanvasStyle.fontWeight} ${fontSize}px ${DefaultCanvasStyle.fontFace}`;
        // 找个空地儿绘制文字到画布上
        let textMetrics = this._ctx2d.measureText(text);
        let w = textMetrics.width;
        let inset = DefaultCanvasStyle.outterInset;

        info = this._findEmptyLineSpace(w, fontSize, inset);
        if (!info) return false;
        info.text = text;

        origin = info.rect.min;
        this._ctx2d.fillText(text, origin.x + inset, origin.y + inset);

        // 计算在图集中的UV坐标，并保存起来
        // let [sx, sy] = this.canvasSize;
        // let size = info.rect.getSize();
        // g_AtlasManager.addLayerAtlasInfo(AtlasManager.GLOBAL_CATGORY, AtlasManager.CANVAS_ATLAS_NAME,
        //     {
        //         frameName: text,
        //         // 注意UV坐标与Canvas画布的纵轴是反向的
        //         offset: new Vector3(origin.x / sx, 1 - (size.height + origin.y) / sy, 0),
        //         scale: new Vector3(size.width / sx, size.height / sy, 1),
        //         size: size
        //     }
        // );

        return true;
    }

    /**
     * 寻找图集中的一个空缺，可以绘制下该文字
     * 现在支持绘制不同大小的字体，字体会找到合适的位置行插入
     * 图片打包算法，一般会将图片先按照从大到小排序，然后用二叉树思想插入的方法。可参考https://blog.csdn.net/hherima/article/details/38560929
     * 但字体打包算法有差别，字体重排序的话就要重新绘制，所以要先来的字体先绘制。
     * 遵守小字体与小字体排在一起，大字体与大字体排在一起优先的选择
     *
     * @param {number} w, h - 文字块的测量实际尺寸，不包括外部空隙间距
     * @param {number} inset - 文字块的外部间距
     * @returns {Canvas2DWrapper.CanvasBlockInfo} 图集中的位置坐标
     */
    _findEmptyLineSpace(w, h, inset) {
        let [sx, sy] = this.canvasSize;
        if (w > sx || h > sy) {
            throw Error('Too big text picture to draw onto canvas!');
        }

        let record = null;
        let height = 0; // 记录当前索引的起始高度位置

        for (let i = 0, length = this._lines.length; i <= length; i++) {
            if (!this._lines[i]) {
                // 检索到最后一行还没有位置的话，就创建一个新的一行
                this._lines.push({
                    lineHeight: h + inset * 2, // 以第一个字体的高度为此行最大值
                    cursor: new Vector2(w + inset * 2, height) // 此时计算行剩余的位置
                });

                record = {
                    line: i,
                    rect: new Box2().set(
                        new Vector2(0, height),
                        new Vector2(w + inset * 2, height + h + inset * 2)
                    )
                };
            } else if (h + inset * 2 <= this._lines[i].lineHeight && this._lines[i].cursor.x + (w + inset * 2) < sx) {
                // 在以前的行里面找位置
                record = {
                    line: i,
                    rect: new Box2().set(
                        new Vector2(this._lines[i].cursor.x, height),
                        new Vector2(this._lines[i].cursor.x + w + inset * 2, height + h + inset * 2)
                    )
                };

                this._lines[i].cursor.x += w + inset * 2;
            }
            height += this._lines[i].lineHeight;

            if (record) break;
        }

        this._atlasInfo.push(record);

        return record;
    }
}

let _canvas = null;

function getCanvas(width, height) {
    if (!_canvas) {
        _canvas = new Canvas2DWrapper(width, height);
    }

    return _canvas;
}

export { getCanvas, DefaultCanvasStyle };