import { BarGroup, Bar } from '@vx/shape';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { XYChart, GroupedBarSeries } from '../src/';

describe('<GroupedBarSeries />', () => {
  const mockProps = {
    xScale: { type: 'band' },
    yScale: { type: 'linear', includeZero: false },
    width: 100,
    height: 100,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    ariaLabel: 'label',
  };

  const mockData = [
    { x: '2017-01-05', a: 1, b: 2, c: 3, y: 6 },
    { x: '2018-01-05', a: 7, b: 7, c: 7, y: 21 },
    { x: '2019-01-05', a: 5, b: 3, c: 1, y: 9 },
  ];

  const mockGroupKeys = ['a', 'b', 'c'];

  test('it should be defined', () => {
    expect(GroupedBarSeries).toBeDefined();
  });

  test('it should not render without x- and y-scales', () => {
    expect(shallow(<GroupedBarSeries groupKeys={[]} data={[]} />).type()).toBeNull();
  });

  test('it should render a BarGroup', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <GroupedBarSeries groupKeys={mockGroupKeys} data={mockData} />
      </XYChart>,
    );
    const series = wrapper.find(GroupedBarSeries).dive();
    expect(series.find(BarGroup).length).toBe(1);
  });

  test('it should render one rect per x value per group key', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <GroupedBarSeries
          groupKeys={mockGroupKeys}
          data={mockData}
        />
      </XYChart>,
    );
    const rects = wrapper.render().find('rect');
    expect(rects.length).toBe(mockGroupKeys.length * mockData.length);
  });

  test('it should use groupFills for color', () => {
    const fills = ['magenta', 'maplesyrup', 'banana'];
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <GroupedBarSeries
          groupKeys={['a', 'b', 'c']}
          groupFills={fills}
          data={mockData}
        />
      </XYChart>,
    );
    const rects = wrapper.render().find('rect');
    rects.each((i, rect) => {
      const fill = rect.attribs.fill;
      expect(fills.some(f => f === fill)).toBe(true);
    });
  });

  test('it should call onMouseMove({ datum, data, event, key, color }) and onMouseLeave() on trigger', () => {
    const fills = ['magenta', 'maplesyrup', 'banana'];
    const stackKeys = ['a', 'b', 'c'];
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();

    const wrapper = mount(
      <XYChart {...mockProps} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <GroupedBarSeries
          groupKeys={['a', 'b', 'c']}
          groupFills={fills}
          data={mockData}
        />
      </XYChart>,
    );

    const bar = wrapper.find(Bar).first();
    bar.simulate('mousemove');

    expect(onMouseMove).toHaveBeenCalledTimes(1);
    const args = onMouseMove.mock.calls[0][0];
    expect(args.data).toBe(mockData);
    expect(args.datum).toBe(mockData[0]);
    expect(args.event).toBeDefined();
    expect(stackKeys.includes(args.key)).toBe(true);
    expect(fills.includes(args.color)).toBe(true);

    bar.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});
