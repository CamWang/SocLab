# CSS Review

## 元素

### Background 背景

```css
body {
    background-image: url("image.png");
    background-repeat: no-repeat;
    background-position: right top;
    background-attachment: fixed;   // or scroll
    background-size: 300px 100px;   // width/height or auto or cover

    background: #fff url("image.png") no-repeat right top;
}
```

### Position 位置
```css
div {
    max-width: 500px;
    margin: auto;   // 数值规律：上右下左，
}
```