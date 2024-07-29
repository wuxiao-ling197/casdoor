// Copyright 2022 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react";
import {DeleteOutlined, DownOutlined, LinkOutlined, UpOutlined} from "@ant-design/icons";
import {Button, Col, Input, Row, Select, Table, Tooltip} from "antd";
import * as Setting from "../Setting";
import i18next from "i18next";

const {Option} = Select;

class ManagedAccountTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      managedAccounts: this.props.table !== null ? this.props.table.map((item, index) => {
        item.key = index;
        return item;
      }) : [],
    };
  }

  count = this.props.table?.length ?? 0;

  updateTable(table) {
    this.setState({
      managedAccounts: table,
    });

    this.props.onUpdateTable([...table].map((item) => {
      const newItem = Setting.deepCopy(item);
      delete newItem.key;
      return newItem;
    }));
  }

  updateField(table, index, key, value) {
    table[index][key] = value;
    this.updateTable(table);
  }

  addRow(table) {
    const row = {key: this.count, application: "", username: "", password: ""};
    if (table === undefined || table === null) {
      table = [];
    }

    this.count += 1;
    table = Setting.addRow(table, row);
    this.updateTable(table);
  }

  deleteRow(table, i) {
    table = Setting.deleteRow(table, i);
    this.updateTable(table);
  }

  upRow(table, i) {
    table = Setting.swapRow(table, i - 1, i);
    this.updateTable(table);
  }

  downRow(table, i) {
    table = Setting.swapRow(table, i, i + 1);
    this.updateTable(table);
  }

  renderTable(table) {
    const columns = [
      {
        title: i18next.t("general:Application"),
        dataIndex: "application",
        key: "application",
        render: (text, record, index) => {
          const items = this.props.applications;
          return (
            <Select virtual={false} style={{width: "100%"}}
              value={text}
              onChange={value => {
                this.updateField(table, index, "application", value);
              }} >
              {
                items.map((item, index) => <Option key={index} value={item.name}>{item.name}</Option>)
              }
            </Select>
          );
        },
      },
      {
        title: i18next.t("general:Signin URL"),
        dataIndex: "signinUrl",
        key: "signinUrl",
        // width: "420px",
        render: (text, record, index) => {
          return (
            <Input prefix={<LinkOutlined />} value={text} onChange={e => {
              this.updateField(table, index, "signinUrl", e.target.value);
            }} />
          );
        },
      },
      {
        title: i18next.t("signup:Username"),
        dataIndex: "username",
        key: "username",
        width: "200px",
        render: (text, record, index) => {
          return (
            <Input value={text} onChange={e => {
              this.updateField(table, index, "username", e.target.value);
            }} />
          );
        },
      },
      {
        title: i18next.t("general:Password"),
        dataIndex: "password",
        key: "password",
        width: "200px",
        render: (text, record, index) => {
          return (
            <Input.Password value={text} onChange={e => {
              this.updateField(table, index, "password", e.target.value);
            }} />
          );
        },
      },
      {
        title: i18next.t("general:Action"),
        key: "action",
        width: "100px",
        render: (text, record, index) => {
          return (
            <div>
              <Tooltip placement="bottomLeft" title={i18next.t("general:Up")}>
                <Button style={{marginRight: "5px"}} disabled={index === 0} icon={<UpOutlined />} size="small" onClick={() => this.upRow(table, index)} />
              </Tooltip>
              <Tooltip placement="topLeft" title={i18next.t("general:Down")}>
                <Button style={{marginRight: "5px"}} disabled={index === table.length - 1} icon={<DownOutlined />} size="small" onClick={() => this.downRow(table, index)} />
              </Tooltip>
              <Tooltip placement="topLeft" title={i18next.t("general:Delete")}>
                <Button icon={<DeleteOutlined />} size="small" onClick={() => this.deleteRow(table, index)} />
              </Tooltip>
            </div>
          );
        },
      },
    ];

    return (
      <Table scroll={{x: "max-content"}} rowKey="key" columns={columns} dataSource={table} size="middle" bordered pagination={false}
        title={() => (
          <div>
            {this.props.title}&nbsp;&nbsp;&nbsp;&nbsp;
            <Button style={{marginRight: "5px"}} type="primary" size="small" onClick={() => this.addRow(table)}>{i18next.t("general:Add")}</Button>
          </div>
        )}
      />
    );
  }

  render() {
    return (
      <div>
        <Row style={{marginTop: "20px"}} >
          <Col span={24}>
            {
              this.renderTable(this.state.managedAccounts)
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default ManagedAccountTable;
