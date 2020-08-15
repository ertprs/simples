$(function () {
    $("#ncms").DataTable({
        "language": {
            "url": "datatables/json/Portuguese-Brasil.json"
        },
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true
    });
    $("#cfop").DataTable({
        "language": {
            "url": "datatables/json/Portuguese-Brasil.json"
        },
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true
    });

    $("#produtos").DataTable({
        "language": {
            "url": "datatables/json/Portuguese-Brasil.json"
        },
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true
    });
});