/**********************************************************************
 * Copyright (C) 2022 Red Hat, Inc.
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

import * as extensionApi from '@podman-desktop/api';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

function registerProvider(
  extensionContext: extensionApi.ExtensionContext,
  provider: extensionApi.Provider,
  providerSocketPath: string,
): void {
  const containerProviderConnection: extensionApi.ContainerProviderConnection = {
    name: 'Lima',
    type: 'podman',
    status: () => 'unknown',
    endpoint: {
      socketPath: providerSocketPath,
    },
  };

  const disposable = provider.registerContainerProviderConnection(containerProviderConnection);
  provider.updateStatus('started');
  extensionContext.subscriptions.push(disposable);
  console.log('Lima extension is active');
}

export async function activate(extensionContext: extensionApi.ExtensionContext): Promise<void> {
  const socketPath = path.resolve(os.homedir(), '.lima/podman-lima/sock/podman.sock');
  const socketAlternativePath = path.resolve(os.homedir(), '.lima/podman-lima/sock/podman.sock');

  let provider;
  if (fs.existsSync(socketPath) || fs.existsSync(socketAlternativePath)) {
    provider = extensionApi.provider.createProvider({
      name: 'Lima',
      id: 'lima',
      status: 'unknown',
      images: {
        icon: './icon.png',
        logo: {
          dark: './logo-dark.png',
          light: './logo-light.png',
        },
      },
    });
    extensionContext.subscriptions.push(provider);
  }

  if (fs.existsSync(socketPath)) {
    registerProvider(extensionContext, provider, socketPath);
  } else if (fs.existsSync(socketAlternativePath)) {
    registerProvider(extensionContext, provider, socketAlternativePath);
  } else {
    console.error(`Could not find podman socket at ${socketPath} nor ${socketAlternativePath}`);
  }
}

export function deactivate(): void {
  console.log('stopping lima extension');
}
