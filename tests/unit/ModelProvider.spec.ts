/*
 *  Copyright 2021 Mavice LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { ModelManager, PathUtils } from '@adobe/aem-spa-page-model-manager';
import { ModelProvider, withModel } from '../../src/components/ModelProvider';
import { Constants } from '../../src/Constants';
import 'reflect-metadata'
import { mount } from "@vue/test-utils";
import { Component, Prop, Mixins, Vue } from 'vue-property-decorator'
import { MappedComponentPropertiesMixin } from '../../src/components/Container';
import Utils from '../../src/Utils';

describe('ModelProvider ->', () => {
    const TEST_PAGE_PATH = '/page/jcr:content/root';
    const ROOT_NODE_CLASS_NAME = 'root-class';
    const INNER_COMPONENT_ID = 'innerContent';
    const TEST_COMPONENT_MODEL = { ':type': 'test/components/componentchild' };

    let rootNode: any;

    @Component
    class DummyProps extends Vue{
        @Prop() className!: string;
        @Prop({ default: false }) cqForceReload?: boolean;
        @Prop({ default: false }) isInEditor!: boolean;
        @Prop({ default: '' }) cqPath!: string;
    }

    @Component
    class Dummy extends Mixins(DummyProps) {
        render(createElement: Function) {
            return createElement('div', {
                attrs: {
                    id: INNER_COMPONENT_ID,
                    class: this.className
                },
                domProps: {
                    innerHTML: 'Dummy'
                }
            })
        }
    }

    let addListenerSpy: jest.SpyInstance;
    let getDataSpy: jest.SpyInstance;

    beforeEach(() => {
        addListenerSpy = jest.spyOn(ModelManager, 'addListener').mockImplementation();
        getDataSpy = jest.spyOn(ModelManager, 'getData').mockResolvedValue(TEST_COMPONENT_MODEL);

        rootNode = document.createElement('div');
        rootNode.className = ROOT_NODE_CLASS_NAME;
        document.body.appendChild(rootNode);
    });

    afterEach(() => {

        if (rootNode && document.querySelector(rootNode.className)) {
            document.body.removeChild(rootNode);
        }
    });

    describe('Tag instantiation ->', () => {
        beforeEach(() => {
            addListenerSpy.mockReset();
        });

        it('should initialize properly without parameter', () => {
            const vm = mount(ModelProvider, {
                attachTo: rootNode,
                propsData: {
                    wrappedComponent: Dummy
                }
            });

            expect(addListenerSpy).toHaveBeenCalledWith('', expect.any(Function));

            const childNode = vm.find('#' + INNER_COMPONENT_ID);

            expect(childNode).toBeDefined();
        });


        it('should initialize properly with a path parameter', () => {
            const vm = mount(ModelProvider, {
                attachTo: rootNode,
                propsData: {
                    cqPath: TEST_PAGE_PATH,
                    wrappedComponent: Dummy
                }
            });


            expect(addListenerSpy).toHaveBeenCalledWith(TEST_PAGE_PATH, expect.any(Function));

            const childNode = vm.find('#' + INNER_COMPONENT_ID);

            expect(childNode).toBeDefined();
        });
    });

    describe('Get data ->', () => {
        beforeEach(() => {
            getDataSpy.mockReset();
            addListenerSpy.mockReset();
        });

        it('should subscribe on the data with undefined parameters', () => {
            getDataSpy.mockResolvedValue({});
            const vm = mount(ModelProvider, {
                attachTo: rootNode,
                propsData: {
                    wrappedComponent: Dummy
                }
            });


            expect(addListenerSpy).toHaveBeenCalledWith('', expect.any(Function));
        });

        it('should subscribe on the data with the provided attributes', () => {
            getDataSpy.mockResolvedValue({});
            const vm = mount(ModelProvider, {
                attachTo: rootNode,
                propsData: {
                    cqPath: TEST_PAGE_PATH,
                    cqForceReload: true,
                    wrappedComponent: Dummy
                }
            });


            expect(addListenerSpy).toHaveBeenCalledWith(TEST_PAGE_PATH, expect.any(Function));
        });
    });

    describe('withModel ->', () => {
    beforeEach(() => {
        addListenerSpy.mockReset();
    });

    it('should initialize properly without parameter', () => {
        const DummyWithModel: any = withModel(Dummy);

        const vm = mount(DummyWithModel, {
            attachTo: rootNode,
        });

        expect(addListenerSpy).toHaveBeenCalledWith('', expect.any(Function));

        const childNode = vm.find('#' + INNER_COMPONENT_ID);

        expect(childNode).toBeDefined();
    });

    it('should initialize properly with a path parameter', () => {
        const DummyWithModel = withModel(Dummy);

        const vm = mount(DummyWithModel, {
            attachTo: rootNode,
            propsData: {
                cqPath: TEST_PAGE_PATH,
            }
        });


        expect(addListenerSpy).toHaveBeenCalledWith(TEST_PAGE_PATH, expect.any(Function));

        const childNode = vm.find('#' + INNER_COMPONENT_ID);

        expect(childNode).toBeDefined();
    });

    it('should render a subpage properly when page path is provided', () => {
        const DummyWithModel = withModel(Dummy, { injectPropsOnInit: true });

        const vm = mount(DummyWithModel, {
            attachTo: rootNode,
            propsData: {
                pagePath: TEST_PAGE_PATH,
            }
        });

        expect(getDataSpy).toHaveBeenCalledWith({ path: TEST_PAGE_PATH, forceReload: false });

        const childNode = vm.find('#' + INNER_COMPONENT_ID);

        expect(childNode).toBeDefined();
    });

    it('should render components properly when component cqPath is provided', () => {

        const DummyWithModel = withModel(Dummy, { injectPropsOnInit: true });

        const vm = mount(DummyWithModel, {
            attachTo: rootNode,
            propsData: {
                cqPath: TEST_PAGE_PATH,
            }
        });


        expect(getDataSpy).toHaveBeenCalledWith({ path: TEST_PAGE_PATH, forceReload: false });

        const childNode = vm.find('#' + INNER_COMPONENT_ID);

        expect(childNode).toBeDefined();
    });

    it('should render components properly when containing page path and path to item is provided', () => {
        addListenerSpy = jest.spyOn(ModelManager, 'addListener').mockImplementationOnce((path, callback) => {
            callback();
        });

        const PAGE_PATH = '/page/subpage';
        const ITEM_PATH = 'root/paragraph';

        const DummyWithModel = withModel(Dummy, { injectPropsOnInit: true });

        const vm = mount(DummyWithModel, {
            attachTo: rootNode,
            propsData: {
                pagePath: PAGE_PATH,
                itemPath: ITEM_PATH,
            }
        });

        expect(addListenerSpy).toHaveBeenCalled();
        expect(getDataSpy).toHaveBeenCalledWith({
            path: `${PAGE_PATH}/jcr:content/${ITEM_PATH}`,
            forceReload: false
        });

        const childNode = vm.find('#' + INNER_COMPONENT_ID);

        expect(childNode).toBeDefined();
    });


    it('should fire event to reload editables when in editor', async () => {
        const dispatchEventSpy: jest.SpyInstance =
            jest.spyOn(PathUtils, 'dispatchGlobalCustomEvent').mockImplementation();
        const isInEditor:jest.SpyInstance = jest.spyOn(Utils, 'isInEditor').mockImplementation(() => true);

        const DummyWithModel = withModel(Dummy, { injectPropsOnInit: true });

        const vm = mount(DummyWithModel, {
            attachTo: rootNode,
            propsData: {
                pagePath: TEST_PAGE_PATH,
            }
        });


        expect(getDataSpy).toHaveBeenCalledWith({ path: TEST_PAGE_PATH, forceReload: false });

        const childNode = vm.find('#' + INNER_COMPONENT_ID);

        expect(childNode).toBeDefined();

        //TODO
        // expect(dispatchEventSpy).toHaveBeenCalledWith(Constants.ASYNC_CONTENT_LOADED_EVENT, {})

        isInEditor.mockReset();
        dispatchEventSpy.mockReset();
    });
});


    describe('Unmount -> ', () => {
        it('should remove listeners on unmount', () => {
            const removeListenerSpy: jest.SpyInstance = jest.spyOn(ModelManager, 'removeListener').mockImplementation();

            const vm = mount(ModelProvider, {
                attachTo: rootNode,
                propsData: {
                    cqPath: TEST_PAGE_PATH,
                    wrappedComponent: Dummy
                }
            });

            vm.destroy();

            expect(removeListenerSpy).toHaveBeenCalledWith(TEST_PAGE_PATH, expect.any(Function));
        });
    });
});