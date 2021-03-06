'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectDesigner = function (_React$PureComponent) {
    _inherits(ProjectDesigner, _React$PureComponent);

    function ProjectDesigner(props) {
        _classCallCheck(this, ProjectDesigner);

        var _this = _possibleConstructorReturn(this, (ProjectDesigner.__proto__ || Object.getPrototypeOf(ProjectDesigner)).call(this, props));

        var initState = {};

        _this.state = initState;
        _this.flowMCRef = React.createRef();
        _this.contenPanelRef = React.createRef();
        _this.attrbutePanelRef = React.createRef();
        _this.outlineRef = React.createRef();
        _this.dataMasterPanelRef = React.createRef();
        _this.quickMenuRef = React.createRef();
        autoBind(_this);
        _this.props.project.designer = _this;

        _this.placingCtonrols = {};
        _this.selectedKernel = null;
        return _this;
    }

    _createClass(ProjectDesigner, [{
        key: 'propUpMenu',
        value: function propUpMenu(items_arr, pos, callBack) {
            this.quickMenuRef.current.popMenu(items_arr, pos, callBack);
        }
    }, {
        key: 'selectKernel',
        value: function selectKernel(kernel) {
            /*
            if(this.selectedKernel == kernel){
                return;
            }
            if(this.selectedKernel){
                this.selectedKernel.setSelected(false);
            }
            if(kernel){
                kernel.setSelected(true);
            }
            this.selectedKernel = kernel;
            */
            if (this.attrbutePanelRef.current) this.attrbutePanelRef.current.setTarget(kernel);
        }
    }, {
        key: 'mouseDownControlIcon',
        value: function mouseDownControlIcon(ctltype) {
            this.contenPanelRef.current.endPlace();
            var thisProject = this.props.project;
            var newKernel = null;
            if (this.placingCtonrols[ctltype] && this.placingCtonrols[ctltype].parent == null) {
                newKernel = this.placingCtonrols[ctltype];
            } else {
                newKernel = thisProject.createKernalByType(ctltype);
                this.placingCtonrols[ctltype] = newKernel;
            }
            if (newKernel == null) {
                console.warn('从' + ctltype + '创建控件失败！');
                return;
            }

            this.startPlaceKernel(newKernel);
        }
    }, {
        key: 'startPlaceKernel',
        value: function startPlaceKernel(theKernel, callBack) {
            this.flowMCRef.current.setGetContentFun(function () {
                return React.createElement(
                    'span',
                    null,
                    '\u653E\u7F6E:',
                    theKernel.description + theKernel.id
                );
            });

            window.addEventListener('mouseup', this.mouseUpInPlacingHandler);
            theKernel.__placing = true;
            this.contenPanelRef.current.startPlace(theKernel);
            this.placeEndCallBack = callBack;
            this.placingKernel = theKernel;
            this.props.project.placingKernel = theKernel;
            theKernel.fireForceRender();
            if (this.outlineRef.current) this.outlineRef.current.startPlace();
        }
    }, {
        key: 'mouseUpInPlacingHandler',
        value: function mouseUpInPlacingHandler(ev) {
            this.flowMCRef.current.setGetContentFun(null);
            window.removeEventListener('mouseup', this.mouseUpInPlacingHandler);
            this.props.project.placingKernel = null;
            this.contenPanelRef.current.endPlace();
            if (this.outlineRef.current) this.outlineRef.current.endPlace();
            if (this.placeEndCallBack) {
                this.placeEndCallBack(this.placingKernel);
                this.placeEndCallBack = null;
            }
            this.placingKernel = null;
            //console.log('mouseUpInPlacingHandler');
            return;
        }
    }, {
        key: 'startDrag',
        value: function startDrag(dragData, callBack, contentFun) {
            if (dragData.info == null) {
                dragData.info = '位置drag';
            }
            if (contentFun == null) {
                this.flowMCRef.current.setGetContentFun(function () {
                    return React.createElement(
                        'span',
                        { className: 'text-nowrap border bg-dark text-light' },
                        dragData.info
                    );
                });
            } else {
                this.flowMCRef.current.setGetContentFun(function () {
                    return contentFun();
                });
            }

            window.addEventListener('mouseup', this.mouseUpInDragingHandler);
            this.dragEndCallBack = callBack;
            this.dragingData = dragData;
        }
    }, {
        key: 'mouseUpInDragingHandler',
        value: function mouseUpInDragingHandler(ev) {
            this.flowMCRef.current.setGetContentFun(null);
            window.removeEventListener('mouseup', this.mouseUpInDragingHandler);
            if (this.dragEndCallBack) {
                this.dragEndCallBack({ x: ev.x, y: ev.y }, this.dragingData);
                this.dragingData = null;
            }
            //console.log(ev);
        }
    }, {
        key: 'FMpositionChanged',
        value: function FMpositionChanged(newPos) {
            if (this.placingKernel != null) {
                if (this.outlineRef.current) this.outlineRef.current.placePosChanged(newPos, this.placingKernel);
                if (this.contenPanelRef.current && !this.outlineRef.current.bMouseInPanel) {
                    this.contenPanelRef.current.placePosChanged(newPos);
                }
            }
        }
    }, {
        key: 'wantOpenPanel',
        value: function wantOpenPanel(panelName) {
            console.log('wantOpenPanel:' + panelName);
            switch (panelName) {
                case 'datamaster':
                    if (this.dataMasterPanelRef.current) {
                        //this.dataMasterPanelRef.current.show();
                        this.dataMasterPanelRef.current.toggle();
                    }
                    break;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var thisProject = this.props.project;
            return React.createElement(
                'div',
                { className: this.props.className },
                React.createElement(DataMasterPanel, { ref: this.dataMasterPanelRef, project: thisProject }),
                React.createElement(SplitPanel, {
                    defPercent: 0.15,
                    barClass: 'bg-secondary',
                    panel1: React.createElement(SplitPanel, {
                        defPercent: 0.7,
                        fixedOne: false,
                        flexColumn: true,
                        panel1: React.createElement(ControlPanel, { project: thisProject, mouseDownControlIcon: this.mouseDownControlIcon }),
                        panel2: React.createElement(OutlinePanel, { project: thisProject, ref: this.outlineRef })
                    }),
                    panel2: React.createElement(SplitPanel, { defPercent: 0.8,
                        fixedOne: false,
                        barClass: 'bg-secondary',
                        panel1: React.createElement(ContentPanel, { project: thisProject, ref: this.contenPanelRef, wantOpenPanel: this.wantOpenPanel }),
                        panel2: React.createElement(AttributePanel, { project: thisProject, ref: this.attrbutePanelRef })
                    })
                }),
                React.createElement(FlowMouseContainer, { project: thisProject, ref: this.flowMCRef, positionChanged: this.FMpositionChanged }),
                React.createElement(QuickMenuContainer, { project: thisProject, ref: this.quickMenuRef })
            );
        }
    }]);

    return ProjectDesigner;
}(React.PureComponent);

/*
<ControlPanel project={thisProject} mouseDownControlIcon={this.mouseDownControlIcon} />
                <ContentPanel project={thisProject} ref={this.contenPanelRef}/>
                <div className='flex-grow-0 flex-shrink-0 bg-light d-flex flex-column' style={{width:'350px'}}>
                    <AttributePanel project={thisProject}/>
                    <OutlinePanel project={thisProject}/>
                </div>

                <SplitPanel defPercent={0.1}
                             panel1={<ContentPanel project={thisProject} ref={this.contenPanelRef} />}
                             panel2={<div className='flex-grow-0 flex-shrink-0 bg-light d-flex flex-column' style={{ width: '350px' }}>
                                        <AttributePanel project={thisProject} />
                                        <OutlinePanel project={thisProject} />
                                    </div>}
                            />
*/