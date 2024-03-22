class Handlers {
    static signUpHandler() {

        $('#register-btn').click(onSignUpBtnClick)
        $('#username').change(validateUsername).keyup(validateUsername)
        $('#mobile').change(validateMobile).keyup(validateMobile)
        $('#password').change(validatePassword).keyup(validatePassword)

        async function onSignUpBtnClick(e) {
            if (validateSignUp()) {
                try {
                    let data = await Helpers.ajx(location.href, {
                        formData: {
                            mobileNumber: $('#mobile').val().trim(),
                            username: $('#username').val().trim(),
                            password: $('#password').val().trim(),
                        }
                    })
                    toastr.success('successfully signed up!')
                    setTimeout(() => {
                        location.href = '/auth/signin'
                    }, 1000)

                } catch (err) {
                    console.log(err);
                    if (err.responseJSON.statusCode == 500) {
                        toastr.error('Something went wrong :(')
                    }
                    if (err.responseJSON.statusCode == 400) {
                        toastr.error(err.responseJSON.message)
                    }
                }
            }
        }

        function validateSignUp() {
            const usernameIsValid = validateUsername();
            const mobileIsValid = validateMobile();
            const passwordIsValid = validatePassword();

            return usernameIsValid && mobileIsValid && passwordIsValid
        }

        function validateUsername() {
            const v = validator;
            const usernameField = $('#username').val().trim();
            if (!v.isEmpty(usernameField)) {
                Helpers.setValidField($('#username'));
                return true;
            } else {
                Helpers.setInvalidField($('#username'));
                return false;
            }
        }

        function validateMobile() {
            const v = validator;
            const mobileField = $('#mobile').val().trim();
            if (!v.isEmpty(mobileField) && v.isNumeric(mobileField) && mobileField.length == 10) {
                Helpers.setValidField($('#mobile'));
                return true;
            } else {
                Helpers.setInvalidField($('#mobile'));
                return false;
            }
        }

        function validatePassword() {
            const v = validator;
            const passwordField = $('#password').val().trim();
            if (!v.isEmpty(passwordField) && v.isStrongPassword(passwordField)) {
                Helpers.setValidField($('#password'));
                return true;
            } else {
                Helpers.setInvalidField($('#password'));
                return false;
            }
        }
    }
    static signInHandler() {

        $('#login-btn').click(onLoginBtnClick)

        async function onLoginBtnClick(e) {
            if (validateSignIn()) {
                try {
                    let data = await Helpers.ajx(location.href, {
                        formData: {
                            mobileNumber: $('#mobile').val().trim(),
                            password: $('#password').val().trim(),
                        }
                    })
                    if (data.success) {
                        toastr.success('Succesfully signed in!')
                        setTimeout(() => {
                            location.href = data.redirect
                        }, 500)
                    }
                } catch (err) {
                    console.log(err);
                    let resJSON = err.responseJSON
                    switch (resJSON.statusCode) {
                        case 500:
                            toastr.error('Something went wrong :(')
                            break;
                        case 400:
                            toastr.error('Invalid mobile or password')
                            break;

                    }
                }
            }
        }

        function validateSignIn() {
            const mobileIsValid = validateMobile();
            const passwordIsValid = validatePassword();

            return mobileIsValid && passwordIsValid
        }

        function validateMobile() {
            const v = validator;
            const mobileField = $('#mobile').val().trim();
            if (!v.isEmpty(mobileField)) {
                Helpers.setValidField($('#mobile'));
                return true;
            } else {
                Helpers.setInvalidField($('#mobile'));
                return false;
            }
        }

        function validatePassword() {
            const v = validator;
            const passwordField = $('#password').val().trim();
            if (!v.isEmpty(passwordField)) {
                Helpers.setValidField($('#password'));
                return true;
            } else {
                Helpers.setInvalidField($('#password'));
                return false;
            }
        }
    }
    static createProductHandler() {
        Helpers.paginationController()
        $('#modal-done').click(() => {
            if ($('#modal-title').text() == 'Create Product') {
                $('#create-product-form').submit()
            }
            if ($('#modal-title').text() == 'Update Product') {
                // Extract values into named variables
                var name = $('#name').val();
                var size = $('#size').val();
                var colour = $('#colour').val();
                var price = $('#price').val();
                var quantity = $('#quantity').val();

                if (name === '' || size === '' || colour === '' || price === '' || quantity === '') {
                    toastr.error('Fill in all fields')
                    return; // Exit function if any field is empty
                }
                // Create an object from the extracted values
                var formData = {
                    name: name,
                    size: size,
                    colour: colour,
                    price: price,
                    quantity: quantity
                };
                $.ajax({
                    type: 'PATCH',
                    url: `/products/${$('#id').val()}`,
                    data: JSON.stringify(formData),
                    cache: false,
                    contentType: 'application/json',
                    processData: false,
                    success: function (data) {
                        toastr.success('product updated!')
                        console.log(data);
                    },
                    error: function (err) {
                        if (err.status == 400)
                            toastr.error(err.responseJSON.message)
                        else
                            toastr.error('something went wrong')
                        console.log(err);
                    }
                });
            }
        })
        $('#create-product-form').on('submit', function (event) {
            event.preventDefault();
            var formData = new FormData($(this)[0]);
            // Send AJAX request
            $.ajax({
                type: 'POST',
                url: '/products',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    toastr.success('product created!')
                    console.log(data);
                },
                error: function (err) {
                    if (err.status == 400)
                        toastr.error(err.responseJSON.message)
                    else
                        toastr.error('something went wrong')
                    console.log(err);
                }
            });
        });
        $('#create-modal').click(() => {
            $('.image-slides').html(`<label for="image">Image</label>
            <input type="file" class="form-control-file" id="image" name="image" required
                accept="image/*" multiple>`);
            $('#modal-title').text('Create Product')
            $('#modal-done').text('Create')
            $('#modal-footer').show()
            Helpers.enableFields()
            $('#product-modal').modal('show');
        })
        $(document).on('click', '.update', function () {
            var productData = $(this).closest('td').data('product');
            // Populate the form fields with product data
            $('#name').val(productData.name);
            $('#size').val(productData.size);
            $('#colour').val(productData.colour);
            $('#price').val(productData.price);
            $('#quantity').val(productData.quantity);
            $('#id').val(productData.id);
            $('.image-slides').html('');
            $('#modal-title').text('Update Product')
            $('#modal-done').text('Update')
            $('#modal-footer').show()
            Helpers.enableFields()
            $('#product-modal').modal('show');

        })
        $(document).on('click', '.delete', function () {
            var productData = $(this).closest('td').data('product');
            $.ajax({
                type: 'DELETE',
                url: `/products/${productData.id}`,
                cache: false,
                processData: false,
                success: function (data) {
                    toastr.success('product deleted!')
                    console.log(data);
                },
                error: function (err) {
                    if (err.status == 400)
                        toastr.error(err.responseJSON.message)
                    else
                        toastr.error('something went wrong')
                    console.log(err);
                }
            });

        })
        $(document).on('click', '.view', function () {
            var productData = $(this).closest('td').data('product');
            $('.image-slides').html(`<div id="carouselExample" class="carousel carousel-dark slide">
            <div class="carousel-inner" id="slds">
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample"
                data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample"
                data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>`);

            var productData = $(this).closest('td').data('product');
            $('#name').val(productData.name);
            $('#size').val(productData.size);
            $('#colour').val(productData.colour);
            $('#price').val(productData.price);
            $('#quantity').val(productData.quantity);
            $('#modal-title').text('View Product')
            $('#modal-done').text('View')
            $('#modal-footer').hide()
            let images = JSON.parse(productData.images)
            var carouselInnerHTML = '';
            for (var i = 0; i < images.length; i++) {
                var imageSrc = images[i];
                var activeClass = i === 0 ? 'active' : ''; // Add 'active' class to the first image

                // Create HTML for each image in the carousel inner
                carouselInnerHTML += `
            <div class="carousel-item ${activeClass}">
                <img src="/${imageSrc}" class="d-block w-100" alt="...">
            </div>`;
            }
            $('#slds').html(carouselInnerHTML)
            Helpers.disableFields()
            $('#product-modal').modal('show');

        })
    }
    static viewProductsHandler() {
        Helpers.paginationController()
    }
    static orderPastHandler() {
        Helpers.paginationController()
    }
    static ordersHandler() {
        Helpers.paginationController()

        $(document).on('click', '.update', async function () {
            let id = +$(this).data('id')
            try {
                await Helpers.ajx('/order/'+id, {
                    formData: {
                        orderStatus:$(this).closest('tr').find('select').val()
                    },
                    method:'patch'
                })
                toastr.success('Order updated')
            } catch (err) {
                if (err.status == 400)
                    toastr.error(err.responseJSON.message)
                else
                    toastr.error('something went wrong')
                console.log(err)
            }
        })
    }
    static viewProductHandler() {
        $('#order-now-btn').click(async function () {
            try {
                await Helpers.ajx('/order', {
                    formData: {
                        productId: +$('#id').val()
                    }
                })
                toastr.success('Order placed')
            } catch (err) {
                if (err.status == 400)
                    toastr.error(err.responseJSON.message)
                else
                    toastr.error('something went wrong')
                console.log(err)
            }
        })
    }
}

class Helpers {
    static setValidField(elem) {
        $(elem).removeClass('form-invalid')
        $(elem).addClass('form-valid')
        $(elem).next().hide()
    }
    static setInvalidField(elem) {
        $(elem).removeClass('form-valid')
        $(elem).addClass('form-invalid')
        $(elem).next().show()
    }
    static ajx(url, { ...opt }) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                type: opt.method ? opt.method : 'post',
                data: JSON.stringify(opt.formData),
                contentType: 'application/json',
                success: (data) => {
                    if (opt.cb) opt.cb()
                    resolve(data)
                },
                error: (err) => {
                    console.log(err);
                    reject(err)
                }
            });
        })
    }
    static disableFields() {
        $('#name').prop('disabled', true);
        $('#size').prop('disabled', true);
        $('#colour').prop('disabled', true);
        $('#price').prop('disabled', true);
        $('#quantity').prop('disabled', true);
    }
    static enableFields() {
        $('#name').prop('disabled', false);
        $('#size').prop('disabled', false);
        $('#colour').prop('disabled', false);
        $('#price').prop('disabled', false);
        $('#quantity').prop('disabled', false);
    }
    static paginationController(totalCount = false) {
        let url = new URLHandler(window.location.href)
        let currentPage = url.getParam('page') || 1
        if (url.pathname.match(/admin\/create-product.*/i) ||
            url.pathname.match(/products\/view.*/i) ||
            url.pathname.match(/order\/past.*/i) ||
            url.pathname.match(/admin\/order.*/i)
        ) {
            console.log('in');
            let count = +(totalCount || $('#count').val())
            var paginator = pagination.create('search', {
                prelink: url.deleteParam('page'),
                current: currentPage,
                rowsPerPage: url.getParam('limit') || 10,
                totalResult: count
            });
            let pageData = paginator.getPaginationData()
            console.log(pageData);
            let pageHtml = `<ul class="pagination justify-content-center">`
            pageHtml += `<li class="page-item ${pageData.previous ? '' : 'disabled'}">
                    <a class="page-link" href="${pageData.previous ? pageData.prelink + 'page=' + pageData.previous : '#'}">Previous</a>
                </li>`
            for (let n of pageData.range) {
                pageHtml += `<li class="page-item ${n == pageData.current ? 'active' : ''}">
                <a class="page-link " 
                href="${pageData.prelink + 'page=' + n} ">
                ${n}
                </a>
                </li>`
            }
            pageHtml += `<li class="page-item ${pageData.next ? '' : 'disabled'}">
                    <a class="page-link" href="${pageData.next ? pageData.prelink + 'page=' + pageData.next : '#'}">Next</a>
                </li>`

            $('#pagination-area').html('').html(pageHtml)
        }
    }
}

class URLHandler {
    constructor(href) {
        this.href = href;
        const url = new URL(href);
        this.pathname = url.pathname
        this.params = Object.fromEntries(url.searchParams.entries());
    }

    hasParam(paramName) {
        return paramName in this.params;
    }

    getParam(paramName) {
        return this.params[paramName];
    }

    setParam(paramName, paramValue) {
        this.params[paramName] = paramValue;
        this.updateHref();
    }

    deleteParam(paramName) {
        delete this.params[paramName];
        this.updateHref();
        return this.href
    }

    updateHref() {
        const searchParams = new URLSearchParams(this.params);
        const newHref = (searchParams.size
            ?
            this.href.split("?")[0] + "?" + searchParams.toString() + "&"
            :
            this.href.split("?")[0] + "?" + searchParams.toString()
        )
        this.href = newHref;
    }
}

