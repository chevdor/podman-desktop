/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import { expect, test, vi } from 'vitest';
import * as extension from './extension';
import * as podmanCli from './podman-cli';
import { getPodmanCli } from './podman-cli';
import type { Configuration } from '@podman-desktop/api';

const config: Configuration = {
  get: () => {
    // not implemented
  },
  has: () => true,
  update: () => Promise.resolve(),
};

vi.mock('@podman-desktop/api', async () => {
  return {
    configuration: {
      getConfiguration: () => config,
    },
    proxy: {
      isEnabled: () => false,
    },
  };
});

test('verify create command called with correct values', async () => {
  const spyExecPromise = vi.spyOn(podmanCli, 'execPromise');
  spyExecPromise.mockImplementation(() => {
    return Promise.resolve('');
  });
  extension.createMachine(
    {
      'podman.factory.machine.cpus': '2',
      'podman.factory.machine.image-path': 'path',
      'podman.factory.machine.memory': '1048000000',
      'podman.factory.machine.diskSize': '250000000000',
    },
    undefined,
  );
  expect(spyExecPromise).toBeCalledWith(
    getPodmanCli(),
    ['machine', 'init', '--cpus', '2', '--memory', '1048', '--disk-size', '250', '--image-path', 'path'],
    {
      env: {},
      logger: undefined,
    },
    undefined,
  );
});
