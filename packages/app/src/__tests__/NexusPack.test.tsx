import { screen } from '@testing-library/react';

import {
  findVisTabs,
  findSelectedVisTab,
  mockConsoleMethod,
  renderApp,
} from '../test-utils';
import { NexusVis } from '../vis-packs/nexus/visualizations';

test('visualize NXdata group with "spectrum" interpretation', async () => {
  await renderApp('/nexus_entry/spectrum');

  await expect(findVisTabs()).resolves.toEqual([NexusVis.NxSpectrum]);

  await expect(
    screen.findByRole('figure', { name: 'twoD_spectrum (arb. units)' }) // signal name + `units` attribute
  ).resolves.toBeVisible();
});

test('visualize NXdata group with "image" interpretation', async () => {
  await renderApp('/nexus_entry/image');

  await expect(findVisTabs()).resolves.toEqual([NexusVis.NxImage]);

  await expect(
    screen.findByRole('figure', { name: 'Interference fringes' }) // `long_name` attribute
  ).resolves.toBeVisible();
});

test('visualize NXdata group with 2D signal', async () => {
  await renderApp('/nexus_entry/nx_process/nx_data');

  await expect(findVisTabs()).resolves.toEqual([
    NexusVis.NxSpectrum,
    NexusVis.NxImage,
  ]);
  await expect(findSelectedVisTab()).resolves.toBe(NexusVis.NxImage);

  await expect(
    screen.findByRole('figure', { name: 'NeXus 2D' }) // `title` dataset
  ).resolves.toBeVisible();
});

test('visualize NXdata group with 1D signal and two 1D axes of same length', async () => {
  await renderApp('/nexus_entry/scatter');

  await expect(findVisTabs()).resolves.toEqual([NexusVis.NxScatter]);

  await expect(
    screen.findByRole('figure', { name: 'scatter_data' })
  ).resolves.toBeVisible();
});

test('visualize NXentry group with relative path to 2D default signal', async () => {
  await renderApp('/nexus_entry');

  await expect(findVisTabs()).resolves.toEqual([
    NexusVis.NxSpectrum,
    NexusVis.NxImage,
  ]);
  await expect(findSelectedVisTab()).resolves.toBe(NexusVis.NxImage);

  await expect(
    screen.findByRole('figure', { name: 'NeXus 2D' }) // `title` dataset
  ).resolves.toBeVisible();
});

test('visualize NXentry group with absolute path to 2D default signal', async () => {
  await renderApp('/nexus_entry/nx_process/absolute_default_path');

  await expect(findVisTabs()).resolves.toEqual([
    NexusVis.NxSpectrum,
    NexusVis.NxImage,
  ]);
  await expect(findSelectedVisTab()).resolves.toBe(NexusVis.NxImage);

  await expect(
    screen.findByRole('figure', { name: 'NeXus 2D' }) // `title` dataset
  ).resolves.toBeVisible();
});

test('visualize NXentry group with old-style signal', async () => {
  await renderApp('/nexus_entry/old-style');

  await expect(findVisTabs()).resolves.toEqual([
    NexusVis.NxSpectrum,
    NexusVis.NxImage,
  ]);
  await expect(findSelectedVisTab()).resolves.toBe(NexusVis.NxImage);

  await expect(
    screen.findByRole('figure', { name: 'twoD' }) // name of dataset with `signal` attribute
  ).resolves.toBeVisible();
});

test('visualize NXroot group with 2D default signal', async () => {
  await renderApp();

  await expect(findVisTabs()).resolves.toEqual([
    NexusVis.NxSpectrum,
    NexusVis.NxImage,
  ]);
  await expect(findSelectedVisTab()).resolves.toBe(NexusVis.NxImage);

  await expect(
    screen.findByRole('figure', { name: 'NeXus 2D' }) // `title` dataset
  ).resolves.toBeVisible();
});

test('visualize NXdata group with 2D complex signal', async () => {
  await renderApp('/nexus_entry/complex');

  await expect(findVisTabs()).resolves.toEqual([
    NexusVis.NxSpectrum,
    NexusVis.NxImage,
  ]);
  await expect(findSelectedVisTab()).resolves.toBe(NexusVis.NxImage);

  await expect(
    screen.findByRole('figure', { name: 'twoD_complex (amplitude)' }) // signal name + complex visualization type
  ).resolves.toBeVisible();
});

test('visualize NXdata group with 2D complex signal and "spectrum" interpretation', async () => {
  await renderApp('/nexus_entry/complex_spectrum');

  await expect(findVisTabs()).resolves.toEqual([NexusVis.NxSpectrum]);

  await expect(
    screen.findByRole('figure', { name: 'twoD_complex' }) // signal name (complex vis type is displayed as ordinate label)
  ).resolves.toBeVisible();
});

test('visualize NXdata group with "rgb-image" interpretation', async () => {
  await renderApp('/nexus_entry/rgb-image');

  await expect(findVisTabs()).resolves.toEqual([NexusVis.NxRGB]);

  await expect(
    screen.findByRole('figure', { name: 'RGB CMY DGW' }) // `long_name` attribute
  ).resolves.toBeVisible();
});

test('follow SILX styles when visualizing NXdata group', async () => {
  await renderApp('/nexus_entry/log_spectrum');

  const logSelectors = await screen.findAllByRole('button', { name: 'Log' });
  expect(logSelectors).toHaveLength(2); // `log_spectrum` requests both axes to be in log scale
});

test('visualize NXentry group with implicit default child NXdata group', async () => {
  await renderApp('/nexus_no_default');

  await expect(findVisTabs()).resolves.toEqual([NexusVis.NxSpectrum]);

  await expect(
    screen.findByRole('figure', { name: 'oneD' }) // signal name of NXdata group "spectrum"
  ).resolves.toBeVisible();
});

test('show error when `default` entity is not found', async () => {
  const errorSpy = mockConsoleMethod('error');
  await renderApp('/nexus_malformed/default_not_found');

  await expect(
    screen.findByText('No entity found at /test')
  ).resolves.toBeVisible();

  expect(errorSpy).toHaveBeenCalledTimes(2); // React logs two stack traces
});

test('show error when `signal` entity is not found', async () => {
  await renderApp('/nexus_malformed/signal_not_found');

  const errorSpy = mockConsoleMethod('error');
  await expect(
    screen.findByText('Expected "unknown" signal entity to exist')
  ).resolves.toBeVisible();

  expect(errorSpy).toHaveBeenCalledTimes(2); // React logs two stack traces
});

test('show error when `signal` entity is not a dataset', async () => {
  await renderApp('/nexus_malformed/signal_not_dataset');

  const errorSpy = mockConsoleMethod('error');
  await expect(
    screen.findByText('Expected "some_group" signal to be a dataset')
  ).resolves.toBeVisible();

  expect(errorSpy).toHaveBeenCalledTimes(2); // React logs two stack traces
});

test('show error when old-style `signal` entity is not a dataset', async () => {
  await renderApp('/nexus_malformed/signal_old-style_not_dataset');

  const errorSpy = mockConsoleMethod('error');
  await expect(
    screen.findByText('Expected old-style "some_group" signal to be a dataset')
  ).resolves.toBeVisible();

  expect(errorSpy).toHaveBeenCalledTimes(2); // React logs two stack traces
});

test('show error when `signal` dataset is not array', async () => {
  await renderApp('/nexus_malformed/signal_not_array');

  const errorSpy = mockConsoleMethod('error');
  await expect(
    screen.findByText('Expected dataset to have array shape')
  ).resolves.toBeVisible();

  expect(errorSpy).toHaveBeenCalledTimes(2); // React logs two stack traces
});

test('show error when `signal` dataset is not numeric', async () => {
  await renderApp('/nexus_malformed/signal_not_numeric');

  const errorSpy = mockConsoleMethod('error');
  await expect(
    screen.findByText('Expected dataset to have numeric or complex type')
  ).resolves.toBeVisible();

  expect(errorSpy).toHaveBeenCalledTimes(2); // React logs two stack traces
});

test('show fallback message when NXdata group has no `signal` attribute', async () => {
  await renderApp('/nexus_malformed/no_signal');

  await expect(
    screen.findByText('No visualization available for this entity.')
  ).resolves.toBeInTheDocument();
});

test('visualize NXdata group with unknown interpretation', async () => {
  await renderApp('/nexus_malformed/interpretation_unknown');

  await expect(findVisTabs()).resolves.toEqual([
    NexusVis.NxSpectrum,
    NexusVis.NxImage,
  ]);
  await expect(findSelectedVisTab()).resolves.toBe(NexusVis.NxImage);

  await expect(
    screen.findByRole('figure', { name: 'fourD' }) // signal name
  ).resolves.toBeVisible();
});

test('visualize NXdata group with "rgb-image" interpretation but incompatible signal', async () => {
  await renderApp('/nexus_malformed/rgb-image_incompatible');

  await expect(findVisTabs()).resolves.toEqual([NexusVis.NxSpectrum]);

  await expect(
    screen.findByRole('figure', { name: 'oneD' }) // signal name
  ).resolves.toBeVisible();
});

test('ignore unknown `SILX_style` options and invalid values', async () => {
  await renderApp('/nexus_malformed/silx_style_unknown');

  const errorSpy = mockConsoleMethod('error');

  await expect(findVisTabs()).resolves.toEqual([NexusVis.NxSpectrum]);

  const scaleSelectors = await screen.findAllByRole('button', {
    name: 'Linear', // the scales of both axes remain unchanged
  });
  expect(scaleSelectors).toHaveLength(2);

  expect(errorSpy).not.toHaveBeenCalled(); // no error
  errorSpy.mockRestore();
});

test('warn in console when `SILX_style` attribute is not valid JSON', async () => {
  const warningSpy = mockConsoleMethod('warn');
  await renderApp('/nexus_malformed/silx_style_malformed');

  await expect(findVisTabs()).resolves.toEqual([NexusVis.NxSpectrum]);

  expect(warningSpy).toHaveBeenCalledWith(
    "Malformed 'SILX_style' attribute: {"
  );
  warningSpy.mockRestore();
});

test('cancel and retry slow fetch of NxSpectrum', async () => {
  jest.useFakeTimers();
  const { user } = await renderApp('/resilience/slow_nx_spectrum');

  // Select NXdata group with spectrum interpretation and start fetching dataset values
  await expect(screen.findByText(/Loading data/)).resolves.toBeVisible();

  // Cancel all fetches at once
  const errorSpy = mockConsoleMethod('error');
  await user.click(await screen.findByRole('button', { name: /Cancel/ }));

  await expect(screen.findByText('Request cancelled')).resolves.toBeVisible();
  expect(errorSpy).toHaveBeenCalledTimes(2); // React logs two stack traces
  errorSpy.mockRestore();

  // Retry all fetches at once
  await user.click(await screen.findByRole('button', { name: /Retry/ }));
  await expect(screen.findByText(/Loading data/)).resolves.toBeVisible();

  // Let fetches succeed
  jest.runAllTimers();

  await expect(screen.findByRole('figure')).resolves.toBeVisible();

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('cancel and retry slow fetch of NxImage', async () => {
  jest.useFakeTimers();
  const { user } = await renderApp('/resilience/slow_nx_image');

  // Select NXdata group with image interpretation and start fetching dataset values
  await expect(screen.findByText(/Loading data/)).resolves.toBeVisible();

  // Cancel all fetches at once
  const errorSpy = mockConsoleMethod('error');
  await user.click(await screen.findByRole('button', { name: /Cancel/ }));
  await expect(screen.findByText('Request cancelled')).resolves.toBeVisible();
  expect(errorSpy).toHaveBeenCalledTimes(2); // React logs two stack traces
  errorSpy.mockRestore();

  // Retry all fetches at once
  await user.click(await screen.findByRole('button', { name: /Retry/ }));
  await expect(screen.findByText(/Loading data/)).resolves.toBeVisible();

  // Let fetches succeed
  jest.runAllTimers();
  await expect(screen.findByRole('figure')).resolves.toBeVisible();

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('retry fetching automatically when re-selecting NxSpectrum', async () => {
  jest.useFakeTimers();
  const { user, selectExplorerNode } = await renderApp(
    '/resilience/slow_nx_spectrum'
  );

  // Select NXdata group with spectrum interpretation and start fetching dataset values
  await expect(screen.findByText(/Loading data/)).resolves.toBeVisible();

  // Cancel all fetches at once
  const errorSpy = mockConsoleMethod('error');
  await user.click(await screen.findByRole('button', { name: /Cancel/ }));
  await expect(screen.findByText('Request cancelled')).resolves.toBeVisible();
  expect(errorSpy).toHaveBeenCalledTimes(2); // React logs two stack traces
  errorSpy.mockRestore();

  // Switch to other entity with no visualization
  await selectExplorerNode('entities');
  await expect(screen.findByText(/No visualization/)).resolves.toBeVisible();

  // Select dataset again
  await selectExplorerNode('slow_nx_spectrum');
  await expect(screen.findByText(/Loading data/)).resolves.toBeVisible();

  // Let fetches succeed
  jest.runAllTimers();
  await expect(screen.findByRole('figure')).resolves.toBeVisible();

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('retry fetching automatically when re-selecting NxImage', async () => {
  jest.useFakeTimers();
  const { user, selectExplorerNode } = await renderApp(
    '/resilience/slow_nx_image'
  );

  // Select NXdata group with image interpretation and start fetching dataset values
  await expect(screen.findByText(/Loading data/)).resolves.toBeVisible();

  // Cancel all fetches at once
  const errorSpy = mockConsoleMethod('error');
  await user.click(await screen.findByRole('button', { name: /Cancel/ }));
  await expect(screen.findByText('Request cancelled')).resolves.toBeVisible();
  expect(errorSpy).toHaveBeenCalledTimes(2); // React logs two stack traces
  errorSpy.mockRestore();

  // Switch to other entity with no visualization
  await selectExplorerNode('entities');
  await expect(screen.findByText(/No visualization/)).resolves.toBeVisible();

  // Select dataset again
  await selectExplorerNode('slow_nx_image');
  await expect(screen.findByText(/Loading data/)).resolves.toBeVisible();

  // Let fetches succeed
  jest.runAllTimers();
  await expect(screen.findByRole('figure')).resolves.toBeVisible();

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('retry fetching automatically when selecting other NxSpectrum slice', async () => {
  jest.useFakeTimers();
  const { user } = await renderApp('/resilience/slow_nx_spectrum');

  // Select NXdata group with spectrum interpretation and start fetching dataset values
  await expect(screen.findByText(/Loading data/)).resolves.toBeVisible();

  // Cancel all fetches at once
  const errorSpy = mockConsoleMethod('error');
  await user.click(await screen.findByRole('button', { name: /Cancel/ }));
  await expect(screen.findByText('Request cancelled')).resolves.toBeVisible();
  expect(errorSpy).toHaveBeenCalledTimes(2); // React logs two stack traces
  errorSpy.mockRestore();

  // Move to other slice to retry fetching automatically
  const d0Slider = screen.getByRole('slider', { name: 'D0' });
  await user.type(d0Slider, '{PageUp}');
  await expect(screen.findByText(/Loading data/)).resolves.toBeVisible();

  // Let fetches succeed
  jest.runAllTimers();
  await expect(screen.findByRole('figure')).resolves.toBeVisible();

  // Move back to first slice to retry fetching it automatically
  await user.type(d0Slider, '{PageDown}');
  await expect(screen.findByText(/Loading data/)).resolves.toBeVisible();

  // Let fetch of first slice succeed
  jest.runAllTimers();
  await expect(screen.findByRole('figure')).resolves.toBeVisible();
  d0Slider.blur(); // remove focus to avoid state update after unmount

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
