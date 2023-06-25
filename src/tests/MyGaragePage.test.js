/**
 *  @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    fireEvent, render, screen, waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import MyGaragePage from '../pages/MyGaragePage';
import { BrowserRouter } from 'react-router-dom';

describe('ui tests for GaragePage component', () => {
    test('renders GaragePage', async () => {
        render(<BrowserRouter><MyGaragePage userId={6} /></BrowserRouter>);
        await waitFor(() => {
            const textElement = screen.getByText(/Pick-up location:/);
            expect(textElement).toBeInTheDocument();
        })
    });

    test('renders Edit Header popup', async () => {
        render(<BrowserRouter><MyGaragePage userId={6} /></BrowserRouter>);

        let editHeaderElem;
        await waitFor(() => {
            editHeaderElem = screen.getByText(/Edit Header/)
        })

        await act(async () => {
            await userEvent.click(editHeaderElem);
        });

        await waitFor(() => {
            const textElement = screen.getByText(/Description:/);
            expect(textElement).toBeInTheDocument();
        });
    });

    // test('renders Add Review popup', async () => {
    //     render(<BrowserRouter><GaragePage ownerIdInput={6} /></BrowserRouter>);

    //     let addReviewElem;
    //     await waitFor(() => {
    //         addReviewElem = screen.getByText(/Add Review/)
    //     })

    //     await act(async () => {
    //         await userEvent.click(addReviewElem);
    //     });

    //     await waitFor(() => {
    //         const textElement = screen.getByText(/Add a review/);
    //         expect(textElement).toBeInTheDocument();
    //     });
    // });

    test('renders Add Post popup', async () => {
        render(<BrowserRouter><MyGaragePage userId={6} /></BrowserRouter>);

        let addReviewElem;
        await waitFor(() => {
            addReviewElem = screen.getByText(/Add Post/)
        })

        await act(async () => {
            userEvent.click(addReviewElem);
        });

        await waitFor(() => {
            const textElement = screen.getByText(/Back/);
            expect(textElement).toBeInTheDocument();
        });
    });

    test('Add Post popup category dropdown', async () => {
        render(<BrowserRouter><MyGaragePage userId={6} /></BrowserRouter>);

        let addReviewElem;
        await waitFor(() => {
            addReviewElem = screen.getByText(/Add Post/)
        })

        await act(async () => {
            userEvent.click(addReviewElem);
        });

        let dropdownElement;

        await waitFor(() => {
            dropdownElement = screen.getByText(/Select a category/);
        });

        await act(async () => {
            userEvent.click(dropdownElement);
        });

        let textElement;
        await waitFor(() => {
            textElement = screen.getByText(/Bedroom/);
            expect(textElement).toBeInTheDocument();
        });
    });

    test('Add Post popup Back button', async () => {
        render(<BrowserRouter><MyGaragePage userId={6} /></BrowserRouter>);

        let addReviewElem;
        await waitFor(() => {
            addReviewElem = screen.getByText(/Add Post/)
        })

        await act(async () => {
            userEvent.click(addReviewElem);
        });

        let buttonElement;

        await waitFor(() => {
            buttonElement = screen.getByText(/Back/);
        });

        await act(async () => {
            userEvent.click(buttonElement);
        });

        let textElement;
        await waitFor(() => {
            textElement = screen.queryByText(/Back/);
            expect(textElement).toBeNull();
        });
    });

    test('Add Post popup empty field Confirm Changes button', async () => {
        render(<BrowserRouter><MyGaragePage userId={6} /></BrowserRouter>);

        let addPostElem;
        await waitFor(() => {
            addPostElem = screen.getByText(/Add Post/)
        })

        await act(async () => {
            userEvent.click(addPostElem);
        });

        let buttonElement;

        await waitFor(() => {
            buttonElement = screen.getByText(/Confirm Changes/);
        });

        await act(async () => {
            userEvent.click(buttonElement);
        });

        let textElement;
        await waitFor(() => {
            textElement = screen.queryByText(/SELL METHOD/);
            expect(textElement).toBeInTheDocument();
        });
    });

    test('Add Post popup fill in field Confirm Changes button', async () => {
        render(<BrowserRouter><MyGaragePage userId={4} /></BrowserRouter>);

        let addPostElem;
        await waitFor(() => {
            addPostElem = screen.getByText(/Add Post/)
        })

        await act(async () => {
            userEvent.click(addPostElem);
        });

        let urlBox, fixedBox, fixedRadio, titleBox, dateBox, descriptionBox, buttonElement;
        let dropdown;
        await waitFor(() => {
            urlBox = screen.getByPlaceholderText(/enter picture url here/);
            fixedBox = screen.getByPlaceholderText(/enter fixed price/);
            fixedRadio = screen.getByTestId("fixed-radio-btn");
            dropdown = screen.getByText(/Select a category/);
            titleBox = screen.getByPlaceholderText(/enter title here/);
            dateBox = screen.getByPlaceholderText(/yyyy-mm-dd/);
            descriptionBox = screen.getByPlaceholderText(/enter description here/);
            buttonElement = screen.getByText(/Confirm/);
        });

        await act(async () => {
            userEvent.type(urlBox, "https://www.investopedia.com/thmb/xy_OJNkGYtpi3JNMl3qc3Ic5EQ8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/thinkstockphotos461251551-5bfc3b1446e0fb0083c48d56.jpg");
            userEvent.type(fixedBox, "10");
            userEvent.type(titleBox, "gold");
            userEvent.type(dateBox, "2100-01-01");
            userEvent.type(descriptionBox, "It shines!");           
        });

        await act(async () => {
            userEvent.click(fixedRadio);
        });

        await act(async () => {
            userEvent.selectOptions(screen.getByTestId('categories'), 'Bedroom');
        });

        await act(async () => {
            userEvent.click(buttonElement);
        });

        let textElement;
        await waitFor(() => {
            textElement = screen.queryByText(/SELL METHOD/);
            expect(textElement).toBeNull();
        });
    });


    test('Edit Post popup renders', async () => {
        render(<BrowserRouter><MyGaragePage userId={6} /></BrowserRouter>);
        
        let dotElements;
        await waitFor(() => {
            dotElements = screen.getAllByTitle('Item Options Button');
        }) 
        let dotElement = dotElements[0];

        await act(async () => {
            await userEvent.click(dotElement);
        });

        let editTextElement;
        await waitFor(() => {
            editTextElement = screen.getByText(/Edit Post/);
        })

        await act(async () => {
            await userEvent.click(editTextElement);
        });

        let textElement;
        await waitFor(() => {
            textElement = screen.queryByText(/SELL METHOD/);
            expect(textElement).toBeInTheDocument();
        });
    });

    test('Delete Post popup renders', async () => {
        render(<BrowserRouter><MyGaragePage userId={6} /></BrowserRouter>);
        
        let dotElements;
        await waitFor(() => {
            dotElements = screen.getAllByTitle('Item Options Button');
        }) 
        let dotElement = dotElements[0];

        await act(async () => {
            await userEvent.click(dotElement);
        });

        let editTextElement;
        await waitFor(() => {
            editTextElement = screen.getByText(/Delete Post/);
        })

        await act(async () => {
            await userEvent.click(editTextElement);
        });

        let textElement;
        await waitFor(() => {
            textElement = screen.queryByText(/Confirm Delete/);
            expect(textElement).toBeInTheDocument();
        });
    });

    test('Delete Post popup confirm delete', async () => {
        render(<BrowserRouter><MyGaragePage userId={4} /></BrowserRouter>);
        
        let dotElements;
        await waitFor(() => {
            dotElements = screen.getAllByTitle('Item Options Button');
        }) 
        let dotElement = dotElements[0];

        await act(async () => {
            await userEvent.click(dotElement);
        });

        let editTextElement;
        await waitFor(() => {
            editTextElement = screen.getByText(/Delete Post/);
        })

        await act(async () => {
            await userEvent.click(editTextElement);
        });

        let buttonElement;
        await waitFor(() => {
            buttonElement = screen.queryByText(/Confirm Delete/);
        });

        await act(async () => {
            userEvent.click(buttonElement);
        });

        let textElement;
        await waitFor(() => {
            textElement = screen.queryByText(/Confirm Delete/);
            expect(textElement).toBeNull();
        });
    });
});
