'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContainerKernelBase = function (_ControlKernelBase) {
    _inherits(ContainerKernelBase, _ControlKernelBase);

    function ContainerKernelBase(initData, project, description) {
        _classCallCheck(this, ContainerKernelBase);

        var _this = _possibleConstructorReturn(this, (ContainerKernelBase.__proto__ || Object.getPrototypeOf(ContainerKernelBase)).call(this, initData, project, description));

        _this.children = [];
        return _this;
    }

    _createClass(ContainerKernelBase, [{
        key: 'appandChild',
        value: function appandChild(childKernel) {
            if (childKernel.parent == this) return;
            if (childKernel.parent) {
                childKernel.parent.removeChild(childKernel);
            }
            this.children.push(childKernel);
            childKernel.parent = this;
            this.attrChanged('children');
        }
    }, {
        key: 'removeChild',
        value: function removeChild(childKernel) {
            var i = this.children.indexOf(childKernel);
            if (i != -1) {
                this.children.splice(i, 1);
                childKernel.parent = null;
                this.attrChanged('children');
            }
        }
    }]);

    return ContainerKernelBase;
}(ControlKernelBase);