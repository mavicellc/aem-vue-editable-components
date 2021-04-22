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

import 'reflect-metadata'
import { mount } from "@vue/test-utils";
import { Component, Prop, Mixins, Vue } from 'vue-property-decorator'
import { withEditable } from '../../src/components/EditableComponent';
import { Constants } from '../../src/Constants';
import Utils from '../../src/Utils';

describe('EditableComponent ->', () => {
    const ROOT_CLASS_NAME = 'root-class';
    const ROOT_ID = 'root';
    const COMPONENT_RESOURCE_TYPE = '/component/resource/type';
    const COMPONENT_PATH = '/path/to/component';
    const CHILD_COMPONENT_CLASS_NAME = 'child-class';
    const IN_EDITOR_CLASS_NAME = 'in-editor-class';
    const EMPTY_LABEL = 'Empty Label';
    const EMPTY_TEXT_SELECTOR = '[data-emptytext="' + EMPTY_LABEL + '"]';
    const DATA_PATH_ATTRIBUTE_SELECTOR = '[data-cq-data-path="' + COMPONENT_PATH + '"]';
    const DATA_RESOURCE_TYPE_SELECTOR = '[' + Constants.DATA_CQ_RESOURCE_TYPE_ATTR + '="' + COMPONENT_RESOURCE_TYPE + '"]';

    const CQ_PROPS = {
        'cqType': COMPONENT_RESOURCE_TYPE,
        'cqPath': COMPONENT_PATH
    };

    let rootNode: any;
    let sandbox: jest.SpyInstance;
    let isInEditor = false;

    @Component({
        components: {}
    })
    class ChildComponentProps extends Vue {
        @Prop() id?: string;
        @Prop({ default: false }) cqForceReload?: boolean;
        @Prop({ default: false }) isInEditor!: boolean;
        @Prop({ default: '' }) cqPath!: string;
    }

    @Component({
        components: {}
    })
    class ChildComponent extends Mixins(ChildComponentProps) {
        render(createElement: Function) {
            const editorClassNames = this.isInEditor ? IN_EDITOR_CLASS_NAME : '';
            return createElement('div', {
                attrs: {
                    class: CHILD_COMPONENT_CLASS_NAME + ' ' + editorClassNames
                },
                props: {
                    id: this.id,
                }
            });
        }
    }

    beforeEach(() => {
        sandbox = jest.spyOn(Utils, 'isInEditor').mockImplementation(() => isInEditor);
        rootNode = document.createElement('div');
        rootNode.className = ROOT_CLASS_NAME;
        rootNode.id = ROOT_ID;
        document.body.appendChild(rootNode);
    });

    afterEach(() => {
        sandbox.mockRestore();

        if (rootNode) {
            document.body.appendChild(rootNode);
            rootNode = undefined;
        }
    });

    describe('Component emptiness ->', () => {
        it('should declare the component to be empty', () => {
            const EDIT_CONFIG = {
                isEmpty: function() {
                    return true;
                },
                emptyLabel: EMPTY_LABEL
            };

            const vm = mount(withEditable(ChildComponent, EDIT_CONFIG), {
                attachTo: rootNode,
                propsData: {
                    ...CQ_PROPS
                }
            });


            const node = vm.find(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME +
                ' + .' + Constants._PLACEHOLDER_CLASS_NAMES + EMPTY_TEXT_SELECTOR);

            expect(node.exists()).toBe(false);
        });

        it('should declare the component to be empty without providing a label', () => {
            const EDIT_CONFIG = {
                isEmpty: function() {
                    return true;
                }
            };

            const vm = mount(withEditable(ChildComponent, EDIT_CONFIG), {
                attachTo: rootNode,
                propsData: {
                    isInEditor: true,
                    ...CQ_PROPS
                }
            });

            let node = vm.find(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + Constants._PLACEHOLDER_CLASS_NAMES + EMPTY_TEXT_SELECTOR);

            expect(node.exists()).toBe(false);

            node = vm.find(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME +
                ' + .' + Constants._PLACEHOLDER_CLASS_NAMES);

            expect(node.exists()).toBe(true);
        });

        it('should declare the component as not being in the editor', () => {
            const EDIT_CONFIG = {
                isEmpty: function() {
                    return true;
                }
            };

            const vm = mount(withEditable(ChildComponent, EDIT_CONFIG), {
                attachTo: rootNode,
                propsData: {
                    isInEditor: false,
                    ...CQ_PROPS
                }
            });


            let node = vm.find('.' + Constants._PLACEHOLDER_CLASS_NAMES + EMPTY_TEXT_SELECTOR);

            expect(node.exists()).toBe(false);

            node = vm.find(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME +
                ' + .' + Constants._PLACEHOLDER_CLASS_NAMES);

            expect(node.exists()).toBe(false);
        });

        it('should declare the component not to be empty', () => {
            const EDIT_CONFIG = {
                isEmpty: function() {
                    return false;
                },
                emptyLabel: EMPTY_LABEL
            };

            const vm = mount(withEditable(ChildComponent, EDIT_CONFIG), {
                attachTo: rootNode,
                propsData: {
                    isInEditor: true,
                    ...CQ_PROPS
                }
            });

            let node = vm.find('.' + CHILD_COMPONENT_CLASS_NAME + ' + .' + Constants._PLACEHOLDER_CLASS_NAMES);

            expect(node.exists()).toBe(false);

            node = vm.find(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME);

            expect(node.exists()).toBe(true);
        });
    });

    describe('resourceType attribute ->', () => {

        it('should have the data-cq-resource-type attribute set when passing this via the Editconfig', () => {
            const EDIT_CONFIG = {
                isEmpty: function() {
                    return false;
                },
                emptyLabel: EMPTY_LABEL,
                resourceType: COMPONENT_RESOURCE_TYPE
            };

            const vm = mount(withEditable(ChildComponent, EDIT_CONFIG), {
                attachTo: rootNode,
                propsData: {
                    isInEditor: true,
                    ...CQ_PROPS
                }
            });

            const node = vm.find(DATA_RESOURCE_TYPE_SELECTOR);
            expect(node.exists()).toBe(true);
        });

        it('should NOT have the data-cq-resource-type attribute set when NOT passing it via the Editconfig', () => {
            const EDIT_CONFIG = {
                isEmpty: function() {
                    return false;
                },
                emptyLabel: EMPTY_LABEL
            };

            const vm = mount(withEditable(ChildComponent, EDIT_CONFIG), {
                attachTo: rootNode,
                propsData: {
                    isInEditor: true,
                    ...CQ_PROPS
                }
            });

            const node = vm.find(DATA_RESOURCE_TYPE_SELECTOR);

            expect(node.exists()).toBe(false);
        });
    });
});