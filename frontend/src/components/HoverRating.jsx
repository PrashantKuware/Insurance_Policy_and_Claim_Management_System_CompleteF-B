import * as React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

export default function HoverRating({ setValues }) {
    const [value, setValue] = React.useState(3);
    const [hover, setHover] = React.useState(-1);
    const display = hover !== -1 ? hover : value;

    const handleSelect = (v) => {
        setValue(v);
        setValues(v);
    };

    return (
        <div className="flex items-center gap-3 flex-shrink-0">
            <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHover(-1)}
            >
                {[1, 2, 3, 4, 5].map((i) => {
                    let Icon = FaRegStar;
                    if (display >= i) Icon = FaStar;
                    else if (display >= i - 0.5) Icon = FaStarHalfAlt;

                    return (
                        <div key={i} className="relative w-6 h-6 cursor-pointer">
                            <Icon className="w-6 h-6 text-amber-400" />
                            <button
                                type="button"
                                aria-label={`${i - 0.5} stars`}
                                className="absolute inset-y-0 left-0 w-1/2"
                                onMouseEnter={() => setHover(i - 0.5)}
                                onClick={() => handleSelect(i - 0.5)}
                            />
                            <button
                                type="button"
                                aria-label={`${i} stars`}
                                className="absolute inset-y-0 right-0 w-1/2"
                                onMouseEnter={() => setHover(i)}
                                onClick={() => handleSelect(i)}
                            />
                        </div>
                    );
                })}
            </div>
            <span className="text-sm text-slate-300 min-w-[70px]">
                {labels[display] || ''}
            </span>
        </div>
    );
}